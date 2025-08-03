// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash)
       VALUES (uuid_generate_v4(), $1, $2, $3)`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration Error:', err); // Full error for debugging
    return res.status(500).json({ error: 'Registration failed' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // ✅ Correct query with correct password field
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userData = user.rows[0];

    // ✅ Password field is 'password_hash' in your DB schema
    const validPassword = await bcrypt.compare(password, userData.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio,
      },
    });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
