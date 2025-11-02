// src/config/database.js

// This will load the .env file from the root of your 'backend' folder
require('dotenv').config(); 
const { Pool } = require('pg');

// This is a good practice for automatically handling SSL on Render
const isProduction = process.env.NODE_ENV === 'production';

// Check that the database URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use SSL in production (on Render), but not for local development
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// ✅ The pool manages connections automatically. 
// You don't need to call pool.connect() here.
// The pool will connect on its own when the first query is made.

module.exports = pool;