// src/controllers/authController.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// -------------------
// REGISTER USER (Your existing code is correct)
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

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user: result.rows[0], token });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};


// -------------------
// LOGIN USER (This is the corrected backend logic)
// -------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    // Send back user data (without the password hash) and token
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