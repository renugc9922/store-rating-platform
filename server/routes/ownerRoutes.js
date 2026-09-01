const express = require("express");

const router = express.Router();

const {
  getOwnerStore,
  getOwnerStoreRatings
} = require("../controllers/ownerController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/store",
  authenticateToken,
  authorizeRoles("OWNER"),
  getOwnerStore
);

router.get(
  "/ratings",
  authenticateToken,
  authorizeRoles("OWNER"),
  getOwnerStoreRatings
);

module.exports = router;