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
    console.error("Get Users Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


// ===============================
// Update user role
// ===============================
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // ✅ validate role
    const allowedRoles = ["admin", "analyst", "user"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: "after" } // mongoose v7+
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔥 REAL-TIME SOCKET EMIT (if enabled later)
    const io = req.app.get("io");
    if (io) {
      io.emit("roleUpdated", {
        userId: user._id,
        role: user.role
      });
    }

    res.json({
      success: true,
      message: "Role updated successfully",
      data: user
    });

  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update role"
    });
  }
};


// ===============================
// Delete user
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔥 REAL-TIME SOCKET EMIT (optional)
    const io = req.app.get("io");
    if (io) {
      io.emit("userDeleted", {
        userId: user._id
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete user"
    });
  }
};
