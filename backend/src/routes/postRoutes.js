const express = require('express');
const router = express.Router();

// ✅ Import the new deletePost function
const { 
  getAllPosts, 
  createPost, 
  getUserPosts, 
  toggleLikePost,
  createCommentOnPost,
  getCommentsForPost,
  deletePost
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
router.get('/', checkOptionalAuth, getAllPosts);
router.post('/', authenticateToken, createPost);
router.get('/user/:id', getUserPosts);
router.post('/:id/like', authenticateToken, toggleLikePost);


// --- COMMENT ROUTES ---
router.get('/:id/comments', getCommentsForPost);
router.post('/:id/comments', authenticateToken, createCommentOnPost);


// --- DELETE ROUTE ---
// ✅ ADDED: The new route for deleting a post (Requires login & ownership)
router.delete('/:id', authenticateToken, deletePost);


module.exports = router;