const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getLoggedInUserProfile } = require('../controllers/userController');

// ✅ Logged-in user route
router.get('/me', authenticateToken, getLoggedInUserProfile);

// Already existing route
router.get('/:id', authenticateToken, getUserProfile);

module.exports = router;
