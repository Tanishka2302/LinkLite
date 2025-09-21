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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // don't log password in production

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare with password_hash
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    let token;
    try {
      token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch (err) {
      console.error('JWT signing error (login):', err);
      return res.status(500).json({ error: 'JWT signing failed' });
    }

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };
