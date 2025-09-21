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

// ✅ ADD THIS NEW FUNCTION for your profile page
const getProfileAndPosts = async (req, res) => {
  try {
    const user = req.user; // From the authenticateToken middleware
    const postsResult = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [user.id]
    );

    // Return both the user info and their posts
    res.status(200).json({ user, posts: postsResult.rows });
  } catch (error) {
    console.error('Get profile and posts error:', error);
    res.status(500).json({ error: 'Server error while fetching profile data' });
  }
};


module.exports = {
  getMe,
  getUserProfile,
  getProfileAndPosts, // ✅ EXPORT the new function
};