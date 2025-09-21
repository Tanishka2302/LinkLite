// controllers/userController.js

const pool = require('../config/database');

// For the logged-in user's own profile (/me)
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// For any user's public profile (/:id)
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from the URL
    const result = await pool.query(
      'SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching user profile' });
  }
};

module.exports = {
  getMe,
  getUserProfile,
};