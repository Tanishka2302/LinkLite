const express = require('express');
const router = express.Router();
const multer = require('multer'); // ✅ for handling file uploads

// ✅ Import controller functions
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

// --- Multer Configuration --- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// --- Optional Auth Middleware --- //
const checkOptionalAuth = (req, res, next) => {
  authenticateToken(req, res, () => {
    next();
  });
};

// --- ROUTES --- //

// --- POST & LIKE ROUTES ---
router.get('/', checkOptionalAuth, getAllPosts);

// ✅ Updated: use multer for image/video upload
router.post('/', authenticateToken, upload.single('media'), createPost);

router.get('/user/:id', getUserPosts);
router.post('/:id/like', authenticateToken, toggleLikePost);

// --- COMMENT ROUTES ---
router.get('/:id/comments', getCommentsForPost);
router.post('/:id/comments', authenticateToken, createCommentOnPost);

// --- DELETE & EDIT ROUTES ---
router.delete('/:id', authenticateToken, deletePost);

// ✅ Updated: allow updating text or image/video
router.put('/:id', authenticateToken, upload.single('media'), updatePost);

module.exports = router;
