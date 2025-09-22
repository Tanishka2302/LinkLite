// Forcing a new deployment with the correct code
const pool = require('../config/database');

// GET ALL POSTS
const getAllPosts = async (req, res) => {
  try {
    // ✅ CHANGED: This query is now more advanced.
    // It gets the total like count and checks if the current user has liked the post.
    const userId = req.user ? req.user.id : null;

    const result = await pool.query(`
      SELECT 
        p.id,
        p.content,
        p.created_at,
        u.id AS author_id,
        u.name AS author_name,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id)::int AS likes_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1) AS has_liked
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `, [userId]);

    res.json({ posts: result.rows });
  } catch (error) {
    console.error('❌ Get all posts error:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

// CREATE POST (Your existing code is correct)
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Post content must be 500 characters or less' });
    }

    const result = await pool.query(
      'INSERT INTO posts (content, author_id) VALUES ($1, $2) RETURNING id, content, created_at',
      [content.trim(), userId]
    );

    const post = result.rows[0];
    const author = { id: req.user.id, name: req.user.name }; // We already have the user from the token

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post,
        authorId: author.id,
        authorName: author.name,
      }
    });
  } catch (error) {
    console.error('❌ Create post error:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while creating post' });
  }
};

// GET POSTS BY USER ID (Your existing code is fine, but can be updated like getAllPosts)
const getUserPosts = async (req, res) => {
  // ... your existing getUserPosts code ...
};

// ✅ ADDED: This is the new function to handle liking and unliking a post.
const toggleLikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;

    const likeResult = await pool.query(
      'SELECT * FROM post_likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (likeResult.rows.length > 0) {
      await pool.query(
        'DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
      res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      await pool.query(
        'INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );
      res.status(200).json({ message: 'Post liked successfully' });
    }
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    res.status(500).json({ error: 'Server error while toggling like' });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getUserPosts,
  toggleLikePost, // ✅ ADDED: Export the new function
};