const express = require('express');
const router = express.Router();

// ✅ Import the new updatePost function
const { 
  getAllPosts, 
  createPost, 
  getUserPosts, 
  toggleLikePost,
  createCommentOnPost,
  getCommentsForPost,
  deletePost,
  updatePost 
} = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');


// Custom middleware for optional authentication on the main feed
const checkOptionalAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    next();
  });
};


// --- POST & LIKE ROUTES ---
router.get('/', checkOptionalAuth, getAllPosts);
router.post('/', authenticateToken, createPost);
router.get('/user/:id', getUserPosts);
router.post('/:id/like', authenticateToken, toggleLikePost);


// --- COMMENT ROUTES ---
router.get('/:id/comments', getCommentsForPost);
router.post('/:id/comments', authenticateToken, createCommentOnPost);


// --- DELETE & EDIT ROUTES ---
router.delete('/:id', authenticateToken, deletePost);

// ✅ ADDED: The new route for updating a post (Requires login & ownership)
router.put('/:id', authenticateToken, updatePost);


module.exports = router;