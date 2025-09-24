const pool = require('../config/database');

// --- POSTS ---

const getAllPosts = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const result = await pool.query(`
      SELECT 
        p.id, p.content, p.created_at, p.updated_at,
        u.id AS author_id, u.name AS author_name,
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
    const { id: userId, name: authorName } = req.user;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const result = await pool.query(
      'INSERT INTO posts (content, author_id) VALUES ($1, $2) RETURNING *',
      [content.trim(), userId]
    );
    
    const newPost = {
      ...result.rows[0],
      author_name: authorName,
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
        u.id AS author_id, u.name AS author_name,
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

// --- LIKES ---

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

// --- COMMENTS ---

const createCommentOnPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: authorId, name: authorName } = req.user;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const result = await pool.query(
      'INSERT INTO comments (content, author_id, post_id) VALUES ($1, $2, $3) RETURNING id, content, created_at',
      [content.trim(), authorId, postId]
    );

    const newComment = {
      ...result.rows[0],
      author_name: authorName,
      author_id: authorId,
    };

    res.status(201).json(newComment);
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    res.status(500).json({ error: 'Server error while creating comment' });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const result = await pool.query(
      `SELECT c.*, u.name AS author_name 
       FROM comments c 
       JOIN users u ON c.author_id = u.id 
       WHERE c.post_id = $1 
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    res.status(500).json({ error: 'Server error while fetching comments' });
  }
};

// --- EDIT / DELETE ---

const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;

    const postResult = await pool.query(
      'SELECT author_id FROM posts WHERE id = $1',
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postResult.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own posts' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    res.status(500).json({ error: 'Server error while deleting post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { id: userId } = req.user;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Post content cannot be empty' });
    }

    const postResult = await pool.query(
      'SELECT author_id FROM posts WHERE id = $1',
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postResult.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own posts' });
    }

    const updatedPostResult = await pool.query(
      'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
      [content.trim(), postId]
    );
      
    res.status(200).json({ message: 'Post updated successfully', post: updatedPostResult.rows[0] });
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