const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Added for the '/all' route
const { getMe, getUserProfile, getProfileAndPosts } = require('../controllers/userController'); // ✅ ADDED: Import the new controller function
const { authenticateToken } = require('../middleware/auth'); // Using your path

// -------------------
// USER ROUTES
// -------------------

// GET /api/users/me -> Gets the logged-in user's profile data
router.get('/me', authenticateToken, getMe);

// ✅ ADDED: Route for the full profile page (user data + posts)
// GET /api/users/me/details -> Gets the logged-in user's profile AND their posts
router.get('/me/details', authenticateToken, getProfileAndPosts);

// GET /api/users/:id -> Gets any user's public profile by their ID
router.get('/:id', getUserProfile);

// ✅ ADDED: Route to get all users (for testing)
// GET /api/users/all -> Gets a list of all users in the database
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;