const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllUsers
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getUserById
);

module.exports = router;