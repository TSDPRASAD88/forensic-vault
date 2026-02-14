const User = require("../models/User");

// ===============================
// Get all users
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ===============================
// Update user role
// ===============================
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
     { returnDocument: "after" }
    ).select("-password");

    res.json({
      success: true,
      message: "Role updated",
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

// ===============================
// Delete user
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted"
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
