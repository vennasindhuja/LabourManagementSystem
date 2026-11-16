const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Sindhuja',
  database: process.env.DB_NAME || 'testdb',
});

async function run() {
  try {
    for (const table of ['labours', 'attendance', 'salary_payments']) {
      const cols = await pool.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`,
        [table]
      );
      console.log(`=== TABLE: ${table} ===`);
      console.log(cols.rows);
      const data = await pool.query(`SELECT * FROM "${table}" LIMIT 5`);
      console.log('Sample rows:', data.rows);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
