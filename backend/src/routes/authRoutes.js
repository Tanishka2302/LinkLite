// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ Make sure this path is correct

router.post('/register', authController.register); // ✅ Make sure `register` is defined
router.post('/login', authController.login);       // ✅ Make sure `login` is defined

module.exports = router;
