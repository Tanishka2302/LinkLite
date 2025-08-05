const pool = require('../config/database');

// GET ALL POSTS
const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.content,
        p.likes,
        p.created_at,
        u.id AS author_id,
        u.name AS author_name,
        u.avatar AS author_avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);

    const posts = result.rows.map(post => ({
      id: post.id,
      content: post.content,
      likes: post.likes,
      timestamp: post.created_at,
      authorId: post.author_id,
      authorName: post.author_name,
      authorAvatar: post.author_avatar
    }));

    res.json({ posts });
  } catch (error) {
    console.error('❌ Get all posts error:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    i
