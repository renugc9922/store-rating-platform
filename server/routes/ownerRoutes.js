const express = require("express");

const router = express.Router();

const {
  getOwnerStore,
  getOwnerStoreRatings
} = require("../controllers/ownerController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ==================== GET OWNER'S STORE ====================
router.get(
  "/store",
  authenticateToken,
  authorizeRoles("OWNER"),
  getOwnerStore
);


// ==================== GET OWNER STORE RATINGS ====================
router.get(
  "/ratings",
  authenticateToken,
  authorizeRoles("OWNER"),
  getOwnerStoreRatings
);


module.exports = router;