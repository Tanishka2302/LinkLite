const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const postController = require('../controllers/postController');

// Protect routes with middleware
router.get('/', authenticateToken, postController.getAllPosts);
router.post('/', authenticateToken, postController.createPost);
// etc.

module.exports = router;
