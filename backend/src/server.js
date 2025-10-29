// ----------------------
// ✅ Imports & Setup
// ----------------------
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express();

// ----------------------
// ✅ Global Header Fallback (guarantees CORS always works)
// ----------------------
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://linklite-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ----------------------
// ✅ CORS Configuration (Render-safe)
// ----------------------
const allowedOrigins = [
  'https://linklite-frontend.onrender.com', // deployed frontend
  'http://localhost:3000', // local dev
];

app.use((req, res, next) => {
  console.log(`🌐 Incoming request from origin: ${req.headers.origin}`);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman / internal
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error('❌ Blocked by CORS:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

// 🧩 Handle preflight requests
app.options('*', cors());

// ----------------------
// ✅ Middleware
// ----------------------
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// ✅ Database Connection
// ----------------------
const pool = require('./config/database');
pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// ----------------------
// ✅ Import Routes
// ----------------------
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// ----------------------
// ✅ Mount Routes
// ----------------------
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
const PORT = process.env.PORT || 10000; // Render provides PORT dynamically
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
