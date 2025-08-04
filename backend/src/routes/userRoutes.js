
const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/users/:id
router.get('/:id', authenticateToken, getUserProfile);

module.exports = router;
