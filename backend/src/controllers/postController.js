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
        u.name AS author_name
        -- REMOVED: u.avatar AS author_avatar
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
      // REMOVED: authorAvatar: post.author_avatar
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

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: 'Post content must be 500 characters or less' });
    }

    const result = await pool.query(
      'INSERT INTO posts (content, author_id) VALUES ($1, $2) RETURNING id, content, likes, created_at',
      [content.trim(), userId]
    );

    const post = result.rows[0];

    // REMOVED: 'avatar' from the SELECT statement
    const authorResult = await pool.query(
      'SELECT id, name FROM users WHERE id = $1',
      [userId]
    );

    const author = authorResult.rows[0];

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post.id,
        content: post.content,
        likes: post.likes,
        timestamp: post.created_at,
        authorId: author.id,
        authorName: author.name,
        // REMOVED: authorAvatar: author.avatar
      }
    });
  } catch (error) {
    console.error('❌ Create post error:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while creating post' });
  }
};

// GET POSTS BY USER ID
const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const result = await pool.query(`
      SELECT 
        p.id,
        p.content,
        p.likes,
        p.created_at,
        u.id AS author_id,
        u.name AS author_name
        -- REMOVED: u.avatar AS author_avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = $1
      ORDER BY p.created_at DESC
    `, [id]);

    const posts = result.rows.map(post => ({
      id: post.id,
      content: post.content,
      likes: post.likes,
      timestamp: post.created_at,
      authorId: post.author_id,
      authorName: post.author_name,
      // REMOVED: authorAvatar: post.author_avatar
    }));

    res.json({ posts });

  } catch (error) {
    console.error('❌ Error fetching posts for user:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while fetching user posts' });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getUserPosts,
};