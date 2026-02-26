-- ============================================================
-- GANI HYPHA — Migration 002: Payment Orders Table
-- Duitku POP v2 Integration — SCA, SICA, SHGA Subscriptions
-- Run this in Supabase SQL Editor:
-- https://app.supabase.com/project/drhitwkbkdnnepnnqbmo/sql/new
-- ============================================================

-- ── PAYMENT ORDERS TABLE ─────────────────────────────────────
-- Menyimpan semua transaksi pembayaran via Duitku
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Order identifiers
  order_id TEXT UNIQUE NOT NULL,        -- merchantOrderId dari Duitku: DS28466-SCASTARTER-1234567890
  duitku_reference TEXT,                 -- reference dari Duitku setelah invoice dibuat
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Plan & payment details
  plan_id TEXT NOT NULL,                 -- sca-starter, sca-pro, sica-starter, dll
  plan_name TEXT NOT NULL,               -- SCA Starter, SICA Professional, dll
  agent TEXT NOT NULL CHECK (agent IN ('SCA', 'SICA', 'SHGA', 'SMA')),
  amount INTEGER NOT NULL,               -- dalam IDR (Rupiah)
  payment_method TEXT DEFAULT 'VC',      -- VC, BC, M2, I1, DA, OV, SA, dll
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  payment_code TEXT,                     -- kode metode pembayaran dari Duitku
  result_code TEXT,                      -- 00 = success, 01 = failed
  
  -- Duitku metadata
  gateway TEXT DEFAULT 'duitku',
  gateway_env TEXT DEFAULT 'sandbox' CHECK (gateway_env IN ('sandbox', 'production')),
  publisher_order_id TEXT,               -- dari Duitku callback
  settlement_date DATE,                  -- tanggal settlement
  
  -- Subscription period
  subscription_starts_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  is_trial BOOLEAN DEFAULT false,
  
  -- User link (optional, jika user sudah login)
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_email ON payment_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_agent ON payment_orders(agent);
CREATE INDEX IF NOT EXISTS idx_payment_orders_plan_id ON payment_orders(plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_created_at ON payment_orders(created_at DESC);

-- ── SUBSCRIPTIONS TABLE ──────────────────────────────────────
-- Track active subscriptions per agent per user
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Subscriber info
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Subscription details
  agent TEXT NOT NULL CHECK (agent IN ('SCA', 'SICA', 'SHGA', 'SMA')),
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  amount INTEGER NOT NULL,               -- monthly amount IDR
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  is_trial BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  
  -- Period
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Payment reference
  payment_order_id TEXT REFERENCES payment_orders(order_id) ON DELETE SET NULL,
  
  -- Usage tracking (untuk plan berbasis limit)
  monthly_usage INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 0,       -- 0 = unlimited
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  
  -- Unique: 1 subscription per (email, agent)
  UNIQUE(customer_email, agent)
);

-- ── INDEXES SUBSCRIPTIONS ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_agent ON subscriptions(agent);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

-- ── TRIGGER: Update updated_at ───────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_payment_orders_updated ON payment_orders;
CREATE TRIGGER trigger_payment_orders_updated
  BEFORE UPDATE ON payment_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_subscriptions_updated ON subscriptions;
CREATE TRIGGER trigger_subscriptions_updated
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ROW LEVEL SECURITY (RLS) ──────────────────────────────────
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Admin dapat melihat semua
CREATE POLICY "Admin full access payment_orders" ON payment_orders
  FOR ALL TO service_role USING (true);

CREATE POLICY "Admin full access subscriptions" ON subscriptions
  FOR ALL TO service_role USING (true);

-- Users dapat melihat order mereka sendiri (via email)
CREATE POLICY "Users see own payment_orders" ON payment_orders
  FOR SELECT TO anon, authenticated
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users see own subscriptions" ON subscriptions
  FOR SELECT TO anon, authenticated
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- ── SEED DATA (contoh untuk development) ─────────────────────
-- INSERT INTO payment_orders (order_id, customer_name, customer_email, plan_id, plan_name, agent, amount, status) VALUES
-- ('DS28466-TEST-001', 'Test User', 'test@example.com', 'sca-starter', 'SCA Starter', 'SCA', 149000, 'paid');

-- ── VIEWS (untuk reporting) ───────────────────────────────────
CREATE OR REPLACE VIEW revenue_summary AS
SELECT
  agent,
  plan_id,
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'paid') as paid_orders,
  SUM(amount) FILTER (WHERE status = 'paid') as total_revenue_idr,
  AVG(amount) FILTER (WHERE status = 'paid') as avg_order_value,
  DATE_TRUNC('month', created_at) as month
FROM payment_orders
GROUP BY agent, plan_id, DATE_TRUNC('month', created_at)
ORDER BY month DESC, total_revenue_idr DESC;

-- ── DONE ─────────────────────────────────────────────────────
-- Tables created: payment_orders, subscriptions
-- Views created: revenue_summary
-- Run: npx supabase db push (or paste in Supabase SQL editor)
