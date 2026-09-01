const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const {
  createUser,
  getDashboardStats,
  getAllUsers,
  getAllStoresWithRatings,
  getUserById
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

router.post(
  "/users",
  authenticateToken,
  authorizeRoles("ADMIN"),
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  body("role")
    .isIn(["USER", "ADMIN"])
    .withMessage("Role must be USER or ADMIN"),
  createUser
);

router.get(
  "/users",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllUsers
);

router.get(
  "/users/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getUserById
);

router.get(
  "/stores",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAllStoresWithRatings
);

module.exports = router;
