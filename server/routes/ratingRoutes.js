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

router.post(
  "/",
  authenticateToken,
  authorizeRoles("USER"),
  createRating
);

router.get(
  "/store/:store_id",
  authenticateToken,
  getRatingsByStore
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("USER"),
  updateRating
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("USER"),
  deleteRating
);

module.exports = router;