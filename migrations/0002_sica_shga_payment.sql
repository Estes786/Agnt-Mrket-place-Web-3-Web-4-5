-- ================================================================
-- GANI HYPHA — Migration 0002: SICA + SHGA + Payment Tables
-- Run this in Supabase SQL Editor:
-- https://app.supabase.com/project/drhitwkbkdnnepnnqbmo/sql/new
-- Date: February 26, 2026
-- ================================================================

-- Table 1: SICA Orders (Katering)
CREATE TABLE IF NOT EXISTS sica_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  event_type TEXT DEFAULT 'buka_bersama',
  pax_count INTEGER DEFAULT 10,
  event_date DATE,
  menu_preference TEXT,
  total_amount BIGINT DEFAULT 0,
  dp_amount BIGINT DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  order_status TEXT DEFAULT 'pending',
  merchant_order_id TEXT,
  duitku_reference TEXT,
  notes TEXT,
  ai_parsed JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: SHGA Orders (Hamper)
CREATE TABLE IF NOT EXISTS shga_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  recipient_name TEXT,
  hamper_type TEXT DEFAULT 'lebaran',
  budget_range TEXT,
  total_amount BIGINT DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  delivery_address TEXT,
  delivery_date DATE,
  payment_status TEXT DEFAULT 'unpaid',
  order_status TEXT DEFAULT 'pending',
  merchant_order_id TEXT,
  duitku_reference TEXT,
  notes TEXT,
  ai_recommendation JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: Payment Orders (Duitku tracking)
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_order_id TEXT UNIQUE NOT NULL,
  plan_id TEXT NOT NULL,
  agent TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'pending',
  duitku_reference TEXT,
  payment_url TEXT,
  callback_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: SCA Analyses
CREATE TABLE IF NOT EXISTS sca_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT,
  contract_text TEXT,
  risk_score INTEGER,
  risk_level TEXT,
  analysis_result JSONB DEFAULT '{}',
  plan_id TEXT DEFAULT 'sca-free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sica_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shga_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sca_analyses ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (untuk backend API)
CREATE POLICY IF NOT EXISTS "service_full_access_sica" ON sica_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_full_access_shga" ON shga_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_full_access_payment" ON payment_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_full_access_sca" ON sca_analyses FOR ALL TO service_role USING (true) WITH CHECK (true);

SELECT 'Migration 0002 complete! SICA + SHGA + payment_orders + sca_analyses tables created.' as status;
