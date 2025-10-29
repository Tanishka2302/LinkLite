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

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, email, and password are required' });
    }

    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIX: Changed column name to 'password_hash'
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    // ✅ CONSISTENCY: Matched token expiration to 7 days
    const token = jwt.sign(
      { id: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

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

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // ✅ FIX: Changed property to 'user.password_hash' to match the database
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    res.status(200).json({ user: userResponse, token });

  } catch (error) {
    console.error('Login user error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};


// -------------------
// EXPORT THE FUNCTIONS
// -------------------
module.exports = {
  registerUser,
  loginUser
};