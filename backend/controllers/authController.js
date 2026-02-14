const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * ================================
 * Register User
 * ================================
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user" // default role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

/**
 * ================================
 * Login User
 * ================================
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Create token with role
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

/**
 * ================================
 * Get Current User
 * ================================
 */
exports.getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
      id: req.user.id,
      role: req.user.role,
      email: req.user.email
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};
