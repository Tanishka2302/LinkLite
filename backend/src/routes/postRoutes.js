const express = require('express');
const router = express.Router();

// ✅ Import all the functions you need from your controller
const { 
  getAllPosts, 
  createPost, 
  getUserPosts, 
  toggleLikePost 
} = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');


// ✅ This small custom middleware allows logged-out users to see posts,
// but still identifies logged-in users to check their 'like' status.
const checkOptionalAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    // We ignore any errors from authenticateToken, allowing the request to continue
    // even if the user isn't logged in. req.user will be set if they are.
    next();
  });
};


// --- POST ROUTES ---

// GET /api/posts - Get all posts (Visible to everyone)
router.get('/', checkOptionalAuth, getAllPosts);

// POST /api/posts - Create a new post (Requires login)
router.post('/', authenticateToken, createPost);

// GET /api/posts/user/:id - Get all posts by a specific user (Visible to everyone)
router.get('/user/:id', getUserPosts);

// ✅ ADDED: The new route for liking/unliking a post (Requires login)
router.post('/:id/like', authenticateToken, toggleLikePost);


module.exports = router;