
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');
require('dotenv').config();

// ✅ Define allowed frontend domains

const allowedOrigins = [
  'http://localhost:3000',
  'https://linklite-frontend.onrender.com'
];
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));


// ✅ Correct CORS setup

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ...rest of your code


// ✅ Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ 404 fallback for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
