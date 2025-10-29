const pool = require('../config/database');

// --- POSTS ---

const getAllPosts = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const result = await pool.query(`
      SELECT 
        p.id, p.content, p.created_at, p.updated_at,
        u.id AS author_id, 
        u.name AS author_name,
        u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id)::int AS likes_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1) AS has_liked
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `, [userId]);
    res.json({ posts: result.rows });
  } catch (error) {
    console.error('❌ Get all posts error:', error.message);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: userId, name: authorName, avatar: authorAvatar } = req.user;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const result = await pool.query(
      'INSERT INTO posts (content, author_id) VALUES ($1, $2) RETURNING *',
      [content.trim(), userId]
    );
    
    const newPost = {
      ...result.rows[0],
      author_id: userId,
      author_name: authorName,
      author_avatar: authorAvatar,
      likes_count: 0,
      has_liked: false,
    };
    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error('❌ Create post error:', error.message);
    res.status(500).json({ error: 'Server error while creating post' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { id: authorId } = req.params;
    const loggedInUserId = req.user ? req.user.id : null;

    const result = await pool.query(`
      SELECT 
        p.id, p.content, p.created_at, p.updated_at,
        u.id AS author_id, 
        u.name AS author_name,
        u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id)::int AS likes_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $2) AS has_liked
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = $1
      ORDER BY p.created_at DESC
    `, [authorId, loggedInUserId]);
    res.json({ posts: result.rows });
  } catch (error) {
    console.error('❌ Error fetching posts for user:', error.message);
    res.status(500).json({ error: 'Server error while fetching user posts' });
  }
};

// --- LIKES, COMMENTS, DELETE ---
// (assuming you have these defined elsewhere)
const toggleLikePost = async (req, res) => { /* ... */ };
const createCommentOnPost = async (req, res) => { /* ... */ };
const getCommentsForPost = async (req, res) => { /* ... */ };
const deletePost = async (req, res) => { /* ... */ };


// --- EDIT POST ---
const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content cannot be empty' });
    }

    // ✅ FIXED: changed 44 → 404 (correct HTTP status)
    const postResult = await pool.query('SELECT author_id FROM posts WHERE id = $1', [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postResult.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own posts' });
    }

    // ✅ FIXED: include updated_at for clarity
    await pool.query(
      'UPDATE posts SET content = $1, updated_at = NOW() WHERE id = $2',
      [content.trim(), postId]
    );
      
    // ✅ Fetch updated post in the same consistent format
    const finalResult = await pool.query(`
      SELECT 
        p.id, p.content, p.created_at, p.updated_at,
        u.id AS author_id, u.name AS author_name, u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id)::int AS likes_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1) AS has_liked
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $2
    `, [userId, postId]);

    res.status(200).json({ message: 'Post updated successfully', post: finalResult.rows[0] });
  } catch (error) {
    console.error('❌ Error updating post:', error);
    res.status(500).json({ error: 'Server error while updating post' });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getUserPosts,
  toggleLikePost,
  createCommentOnPost,
  getCommentsForPost,
  deletePost,
  updatePost,
};
