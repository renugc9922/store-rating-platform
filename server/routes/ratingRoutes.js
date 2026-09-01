const express = require("express");

const router = express.Router();

const {
  createRating,
  getRatingsByStore,
  updateRating,
  deleteRating
} = require("../controllers/ratingController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ==================== CREATE RATING ====================
// Only USER can rate a store

router.post(
  "/",
  authenticateToken,
  authorizeRoles("USER"),
  createRating
);


// ==================== GET RATINGS BY STORE ====================

router.get(
  "/store/:store_id",
  authenticateToken,
  getRatingsByStore
);


// ==================== UPDATE RATING ====================
// USER can update only their own rating

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("USER"),
  updateRating
);


// ==================== DELETE RATING ====================
// USER can delete only their own rating

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("USER"),
  deleteRating
);


module.exports = router;