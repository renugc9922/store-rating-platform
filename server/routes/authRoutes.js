const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  register,
  login,
  updatePassword
} = require("../controllers/authController");

// ==================== REGISTER USER ====================

router.post(
  "/register",

  // Name validation
  body("name")
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage("Name must be between 20 and 60 characters"),

  // Address validation
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),

  // Email validation
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  // Password validation
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  register
);

// ==================== LOGIN USER ====================

router.post(
  "/login",

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters"),

  login
);

// ==================== UPDATE PASSWORD ====================

router.put(
  "/update-password",

  authMiddleware,

  // Current password is required
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  // New password validation
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("New password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      "New password must contain at least one special character"
    ),

  updatePassword
);

module.exports = router;