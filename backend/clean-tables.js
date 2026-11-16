const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || 'Sindhuja'),
  database: process.env.DB_NAME || 'testdb',
});

async function clean() {
  try {
    console.log('Dropping old legacy tables...');
    await pool.query('DROP TABLE IF EXISTS salary_payments CASCADE');
    await pool.query('DROP TABLE IF EXISTS attendance CASCADE');
    await pool.query('DROP TABLE IF EXISTS labours CASCADE');
    await pool.query('DROP TABLE IF EXISTS attendances CASCADE');
    await pool.query('DROP TABLE IF EXISTS payrolls CASCADE');
    await pool.query('DROP TABLE IF EXISTS projects CASCADE');
    console.log('Old tables dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    await pool.end();
  }
}

clean();
