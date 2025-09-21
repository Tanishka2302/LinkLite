const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express();

// ----------------------
// CORS
// ----------------------
const allowedOrigins = [
  'http://localhost:3000',
  'https://linklite-frontend.onrender.com'
];

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

// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// Database
// ----------------------
const pool = require('./config/database'); // adjust path if needed

// ----------------------
// Import Routes
// ----------------------
const authRoutes = require('./routes/authRoutes');   // Register & Login
const userRoutes = require('./routes/userRoutes');   // User profiles
const postRoutes = require('./routes/postRoutes');   // Posts

// ----------------------
// Mount Routes
// ----------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// ----------------------
// Test route
// ----------------------
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend test route is working!' });
});

// ----------------------
// 404 fallback
// ----------------------
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ----------------------
// Global error handler
// ----------------------
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});
// Forcing redeployment with correct CORS order

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL database'))
    .catch(err => console.error('❌ Database connection error:', err));
});
