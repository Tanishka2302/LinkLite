const express = require('express');
const router = express.Router();

// ✅ Import the new comment functions
const { 
  getAllPosts, 
  createPost, 
  getUserPosts, 
  toggleLikePost,
  createCommentOnPost,
  getCommentsForPost
} = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');


// This custom middleware allows logged-out users to see posts,
// but still identifies logged-in users to check their 'like' status.
const checkOptionalAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    next();
  });
};


// --- POST & LIKE ROUTES ---

// GET /api/posts - Get all posts (Visible to everyone)
router.get('/', checkOptionalAuth, getAllPosts);

// POST /api/posts - Create a new post (Requires login)
router.post('/', authenticateToken, createPost);

// GET /api/posts/user/:id - Get all posts by a specific user (Visible to everyone)
router.get('/user/:id', getUserPosts);

// POST /api/posts/:id/like - Toggle a like on a post (Requires login)
router.post('/:id/like', authenticateToken, toggleLikePost);


// --- COMMENT ROUTES ---

// ✅ ADDED: Route to get all comments for a post (Visible to everyone)
router.get('/:id/comments', getCommentsForPost);

// ✅ ADDED: Route to create a new comment on a post (Requires login)
router.post('/:id/comments', authenticateToken, createCommentOnPost);


module.exports = router;