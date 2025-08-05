const pool = require('../config/database');

const getUserProfile = async (req, res) => {
const getLoggedInUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ✅ Use ID from token

    const result = await pool.query(
      'SELECT id, name, email, bio, avatar, created_at FROM users WHERE id = $1',
      [id]
      [userId]
    );

    if (result.rows.length === 0) {
@@ -26,11 +26,11 @@ const getUserProfile = async (req, res) => {
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching user profile' });
    console.error('Get logged-in user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

module.exports = {
  getUserProfile
};
  getLoggedInUserProfile,
};
