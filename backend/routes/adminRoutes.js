const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  updateUserRole,
  deleteUser
} = require("../controllers/adminController");

// Only ADMIN allowed
router.get("/", authMiddleware, allowRoles("admin"), getAllUsers);

router.put("/:id", authMiddleware, allowRoles("admin"), updateUserRole);

router.delete("/:id", authMiddleware, allowRoles("admin"), deleteUser);

module.exports = router;
