// ----------------------
// ✅ Imports & Setup
// ----------------------
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const uploadRoutes = require('./routes/uploadRoutes');


dotenv.config();
const app = express();

// ----------------------
// ✅ Allowed Origins
// ----------------------
const allowedOrigins = [
  'https://linklite-frontend.onrender.com', // deployed frontend
  'http://localhost:3000', // local dev
];

// ----------------------
// ✅ CORS Configuration (must come BEFORE routes)
// ----------------------
app.use((req, res, next) => {
  console.log(`🌐 Incoming request from origin: ${req.headers.origin}`);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use('/api/upload', uploadRoutes);

// ✅ Ensure every preflight request gets proper headers
app.options(
  '*',
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ----------------------
// ✅ Middleware
// ----------------------
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------
// ✅ Uploads folder setup (auto-create if missing)
// ----------------------
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log('🗂️  Created uploads folder automatically');
}
app.use('/uploads', express.static(uploadPath));

// ----------------------
// ✅ Database Connection
// ----------------------
const pool = require('./config/database');
pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// ----------------------
// ✅ Routes
// ----------------------
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// ----------------------
// ✅ Root Route
// ----------------------
app.get('/', (req, res) => {
  res.status(200).send('✅ LinkLite backend is running successfully!');
});

// ----------------------
// ⚠️ 404 Fallback
// ----------------------
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ----------------------
// 🚨 Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ----------------------
// 🚀 Start Server
// ----------------------
const PORT = process.env.PORT || 10000; // Render sets its own PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
