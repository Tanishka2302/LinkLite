const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://linklite-frontend.onrender.com'
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
const pool = require('./config/database');
// your database.js

// ----------------------
// Routes
// ----------------------

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users;');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Posts routes
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, users.name AS author_name
      FROM posts
      JOIN users ON posts.author_id = users.id
      ORDER BY posts.created_at DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts', async (req, res) => {
  const { content, author_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (content, author_id) VALUES ($1, $2) RETURNING *;',
      [content, author_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *;',
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----------------------
// 404 fallback
// ----------------------
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ----------------------
// Error handler
// ----------------------
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
