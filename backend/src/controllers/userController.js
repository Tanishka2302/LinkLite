const pool = require('../config/database');

// Get a user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
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

// Get logged-in user profile from token
const getLoggedInUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get logged-in user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

module.exports = {
  getUserProfile,
  getLoggedInUserProfile
};
