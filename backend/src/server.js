// ----------------------
// Imports & Setup
// ----------------------
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express();

// ----------------------
// CORS Configuration (✅ FIXED)
// ----------------------
const allowedOrigins = [
  'http://localhost:3000',                    // Local frontend
  'https://linklite-frontend.onrender.com',   // Deployed frontend
  'https://linklite-odit.onrender.com'        // Deployed backend (Render domain)
];

app.use((req, res, next) => {
  console.log(`🌐 Incoming request from origin: ${req.headers.origin}`);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// Database Connection
// ----------------------
const pool = require('./config/database');
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Database connection error:', err));

// ----------------------
// Import Routes
// ----------------------
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// ----------------------
// Mount Routes
// ----------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// ----------------------
// Test Route
// ----------------------
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Backend test route is working!' });
});

// ----------------------
// 404 Fallback
// ----------------------
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
