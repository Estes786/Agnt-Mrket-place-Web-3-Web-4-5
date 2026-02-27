/**
 * MIGRATION 002: payment_orders table
 * Session 030 — GANI HYPHA Sovereign Ecosystem
 * 
 * Uses Supabase's postgres.supabase.co direct connection
 * and falls back to REST API approach
 */

const { Client } = require('pg');
const fs = require('fs');

const PROJECT_ID = 'drhitwkbkdnnepnnqbmo';
const DB_PASSWORD = 'Daqukemang4';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaGl0d2tia2RubmVwbm5xYm1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk5OTEwNSwiZXhwIjoyMDg3NTc1MTA1fQ.QTlZlVOr4sdH3R5OPG6YUp_N_-hWP1OFSx8_dIawlkY';
const SB_URL = `https://${PROJECT_ID}.supabase.co`;

// All possible connection strings to try
const configs = [
  // Direct DB (IPv4)
  `postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_ID}.supabase.co:5432/postgres`,
  // Transaction pooler SE Asia
  `postgresql://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  // Session pooler SE Asia  
  `postgresql://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  // Transaction pooler other regions
  `postgresql://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${PROJECT_ID}:${DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
];

const MIGRATION_SQL = `
-- MIGRATION 002: Payment Orders & Subscriptions
-- Session 030 — GANI HYPHA Sovereign Ecosystem

CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  duitku_reference TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  agent TEXT NOT NULL CHECK (agent IN ('SCA','SICA','SHGA','SMA','BDE','SL')),
  amount BIGINT NOT NULL,
  payment_method TEXT DEFAULT 'QRIS',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','expired','refunded')),
  duitku_payment_url TEXT,
  duitku_va_number TEXT,
  duitku_qr_string TEXT,
  payment_due TIMESTAMPTZ,
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_email ON payment_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_agent ON payment_orders(agent);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);

ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
`;

async function tryConnect(connStr) {
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected:', connStr.substring(0, 70) + '...');
    return client;
  } catch (err) {
    console.log('❌ Failed:', connStr.substring(0, 70), '|', err.message.substring(0, 80));
    try { await client.end(); } catch (e) {}
    return null;
  }
}

async function runViaPostgres() {
  let client = null;
  
  for (const config of configs) {
    client = await tryConnect(config);
    if (client) break;
  }
  
  if (!client) {
    return false;
  }
  
  try {
    console.log('\n🔄 Running migration 002...');
    
    // Run each statement
    const statements = MIGRATION_SQL.split(';').filter(s => s.trim().length > 5);
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt) {
        try {
          await client.query(stmt);
          process.stdout.write('.');
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
            console.error(`\n⚠️  Stmt ${i+1}: ${err.message.substring(0, 100)}`);
          } else {
            process.stdout.write('~');
          }
        }
      }
    }
    
    // Verify
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'payment_orders'
    `);
    
    console.log('\n');
    if (result.rows.length > 0) {
      console.log('✅ payment_orders table created successfully!');
    } else {
      console.log('⚠️  Table may not have been created, check errors above');
    }
    
    // Show all tables
    const allTables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('📋 All tables:', allTables.rows.map(r => r.table_name).join(', '));
    
    await client.end();
    return true;
  } catch (err) {
    console.error('Migration error:', err.message);
    await client.end();
    return false;
  }
}

async function checkTableExists() {
  const res = await fetch(`${SB_URL}/rest/v1/payment_orders?limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });
  return res.status === 200;
}

async function printManualInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 MANUAL MIGRATION INSTRUCTIONS');
  console.log('='.repeat(60));
  console.log('Direct database connection failed. Please run this SQL');
  console.log('manually in the Supabase SQL Editor:');
  console.log('\n🔗 URL: https://app.supabase.com/project/drhitwkbkdnnepnnqbmo/sql/new');
  console.log('\n📄 SQL to run:');
  console.log('-'.repeat(40));
  console.log(MIGRATION_SQL);
  console.log('-'.repeat(40));
  
  // Save to file for easy copy-paste
  fs.writeFileSync('/tmp/migration_002_manual.sql', MIGRATION_SQL);
  console.log('\n💾 SQL saved to: /tmp/migration_002_manual.sql');
}

async function main() {
  console.log('🚀 GANI HYPHA Migration 002 Runner');
  console.log('📊 Target: payment_orders table');
  console.log('🔗 Project:', PROJECT_ID);
  console.log('');
  
  // Check if already exists
  console.log('🔍 Checking if payment_orders already exists...');
  const exists = await checkTableExists();
  if (exists) {
    console.log('✅ payment_orders table already exists! Migration not needed.');
    return;
  }
  
  console.log('📌 Table not found. Attempting migration...\n');
  
  // Try PostgreSQL direct connection
  const success = await runViaPostgres();
  
  if (!success) {
    await printManualInstructions();
  }
}

main().catch(console.error);
