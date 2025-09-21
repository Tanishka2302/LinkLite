const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // your database.js

// Test route to get all users (unprotected)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
