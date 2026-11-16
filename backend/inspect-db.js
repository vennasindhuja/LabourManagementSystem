const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || 'Sindhuja'),
  database: process.env.DB_NAME || 'testdb',
});

async function inspect() {
  const tables = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
  );
  console.log('Tables in DB:', tables.rows.map(r => r.table_name));
  await pool.end();
}

inspect();
