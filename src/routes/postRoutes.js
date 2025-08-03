const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, postController.getAllPosts);
router.post('/', authenticateToken, postController.createPost);
router.get('/user/:id', authenticateToken, postController.getUserPosts);

module.exports = router;