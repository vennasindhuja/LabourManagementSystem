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
    const seq = await pool.query('SELECT sequence_name FROM information_schema.sequences');
    console.log('Sequences:', seq.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
