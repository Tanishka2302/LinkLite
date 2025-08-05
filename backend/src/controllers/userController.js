const pool = require('../config/database');

// ✅ Get profile of currently logged-in user
const getLoggedInUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ⬅️ Extracted from token middleware

    const result = await pool.query(
      'SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Get logged-in user profile error:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

// (Optional) ✅ If you still want to fetch user by ID (e.g., admin panel, public profile)
const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Get user by ID error:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while fetching user by ID' });
  }
};

module.exports = {
  getLoggedInUserProfile,
  getUserProfileById, // ⬅️ Optional, include if needed
};
