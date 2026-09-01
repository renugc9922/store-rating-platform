const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ==================== GET ALL USERS ====================
// Only ADMIN can view users

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllUsers
);


// ==================== GET USER BY ID ====================
// Only ADMIN can view user details

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getUserById
);


module.exports = router;