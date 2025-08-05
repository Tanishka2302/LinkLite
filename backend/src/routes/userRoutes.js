const express = require('express');
const router = express.Router();
const { getLoggedInUserProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/users/me
router.get('/me', authenticateToken, getLoggedInUserProfile);

module.exports = router;
