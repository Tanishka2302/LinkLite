const pool = require('../config/database');

const getLoggedInUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Use ID from token

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
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get logged-in user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

module.exports = {
  getLoggedInUserProfile,
};
