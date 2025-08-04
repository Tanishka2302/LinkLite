const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/users/:userId
router.get('/:userId', authenticateToken, getUserById);

module.exports = router;
