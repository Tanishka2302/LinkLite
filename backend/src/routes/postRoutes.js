const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const postController = require('../controllers/postController');

// ✅ Route to get all posts
router.get('/', authenticateToken, postController.getAllPosts);

// ✅ Route to create a post
router.post('/', authenticateToken, postController.createPost);

// ✅ ✅ NEW: Get all posts by a specific user
router.get('/user/:id', authenticateToken, postController.getUserPosts);

module.exports = router;
