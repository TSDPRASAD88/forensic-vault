const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});
