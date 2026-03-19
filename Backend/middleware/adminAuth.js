const Student = require("../Models/Student");

module.exports = async function adminAuth(req, res, next) {
  try {
    const adminId = req.header("x-admin-id");

    if (!adminId) {
      return res.status(401).json({
        message: "Admin authorization required",
      });
    }

    const adminUser = await Student.findById(adminId).select("_id role name email isBlocked");

    if (!adminUser) {
      return res.status(401).json({
        message: "Admin session is invalid",
      });
    }

    if (adminUser.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    if (adminUser.isBlocked) {
      return res.status(403).json({
        message: "BLOCKED",
      });
    }

    req.adminUser = adminUser;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid admin authorization",
    });
  }
};