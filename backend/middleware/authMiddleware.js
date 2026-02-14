const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("✅ User from DB:", user.email, "| Role:", user.role);

    req.user = user;

    next();

  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;
