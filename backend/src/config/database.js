const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/../../.env' });

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL for Render
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error acquiring client:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

module.exports = pool;
