const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const postController = require('../controllers/postController');

// ✅ Get all posts
router.get('/', authenticateToken, postController.getAllPosts);

// ✅ Create a new post
router.post('/', authenticateToken, postController.createPost);

// ✅ ✅ Add this route: Get all posts by a specific user
router.get('/user/:id', authenticateToken, postController.getUserPosts);

module.exports = router;
