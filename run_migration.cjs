const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Coba berbagai koneksi
const configs = [
  // Direct connection via different ports
  'postgresql://postgres:Daqukemang4@db.drhitwkbkdnnepnnqbmo.supabase.co:6543/postgres?pgbouncer=true',
  'postgresql://postgres.drhitwkbkdnnepnnqbmo:Daqukemang4@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.drhitwkbkdnnepnnqbmo:Daqukemang4@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
];

async function tryConnect(connStr) {
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected with:', connStr.substring(0, 60) + '...');
    return client;
  } catch (err) {
    console.log('❌ Failed:', connStr.substring(0, 60), '|', err.message);
    try { await client.end(); } catch (e) {}
    return null;
  }
}

async function runMigration() {
  let client = null;
  
  for (const config of configs) {
    client = await tryConnect(config);
    if (client) break;
  }
  
  if (!client) {
    console.log('\n⚠️  Tidak bisa koneksi langsung ke PostgreSQL.');
    console.log('Akan gunakan Supabase REST API untuk migration...');
    return;
  }
  
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrations/001_initial_schema.sql'), 'utf-8');
    const statements = sql.split(';').filter(s => s.trim().length > 5);
    console.log(`Running ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt) {
        try {
          await client.query(stmt);
          process.stdout.write('.');
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
            console.error(`\n⚠️  Stmt ${i+1}: ${err.message.substring(0, 80)}`);
          } else {
            process.stdout.write('~');
          }
        }
      }
    }
    
    console.log('\n✅ Migration completed!');
    
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('Tables in public schema:');
    result.rows.forEach(r => console.log(' ✅', r.table_name));
    
  } finally {
    await client.end();
  }
}

runMigration().catch(console.error);
