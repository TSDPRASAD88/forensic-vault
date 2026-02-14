module.exports = (...allowedRoles) => {
  return (req, res, next) => {

    console.log("🔐 Required Roles:", allowedRoles);
    console.log("👤 User Role:", req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions"
      });
    }

    next();
  };
};
