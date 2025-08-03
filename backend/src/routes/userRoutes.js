const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/:id', authenticateToken, userController.getUserProfile);

module.exports = router;