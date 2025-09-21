// src/controllers/authController.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// -------------------
// REGISTER USER
// -------------------
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, email, and password are required' });
    }

    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (use password_hash column)
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    // Generate JWT
    let token;
    try {
      token = jwt.sign(
        { id: result.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch (err) {
      console.error('JWT signing error (register):', err);
      return res.status(500).json({ error: 'JWT signing failed' });
    }

    res.status(201).json({ user: result.rows[0], token });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// -------------------
// LOGIN USER
// -------------------
// ----------------------
// Login
// ----------------------
const login = async (email, password) => {
  setLoading(true);
  setAuthError(null);
  try {
    // FIX #1: Added '/api' prefix to the login request URL
    const res = await axios.post(`${API}/api/auth/login`, { email, password });

    setToken(res.data.token);

    // Fetch logged-in user's profile
    // FIX #2: Added '/api' prefix to the user profile request URL
    const profileRes = await axios.get(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });

    setUser(profileRes.data);
  } catch (err) {
    setAuthError(err.response?.data?.error || 'Login failed');
    console.error('Login Error:', err);
    throw err;
  } finally {
    setLoading(false);
  }
};

module.exports = { registerUser, loginUser };
