const express = require("express");
const router = express.Router();

// ✅ Proper import from the controller
const { registerUser, login } = require("../controllers/authController");

// ✅ Confirm these functions are not undefined
console.log("registerUser is:", typeof registerUser); // should be 'function'

router.post("/register", registerUser);
router.post("/login", login);

module.exports = router;
