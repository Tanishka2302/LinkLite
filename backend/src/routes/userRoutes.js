const express = require('express');
const router = express.Router();
const { getMe, getUserProfile } = require('../controllers/userController'); // Import both functions
const { authenticateToken } = require('../middleware/auth');

// GET /api/users/me - Get the logged-in user's profile
router.get('/me', authenticateToken, getMe);

// GET /api/users/:id - Get a user profile by their ID
router.get('/:id', getUserProfile); // Add this new line

module.exports = router;