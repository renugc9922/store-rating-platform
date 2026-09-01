const express = require("express");

const router = express.Router();

const {
  createStore,
  getAllStores,
  getStoreById,
  getOwnerStore,
  updateStore,
  deleteStore
} = require("../controllers/storeController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ==================== GET ALL STORES ====================
router.get(
  "/",
  authenticateToken,
  getAllStores
);

// ==================== GET LOGGED-IN OWNER'S STORE ====================

router.get(
  "/my-store",
  authenticateToken,
  authorizeRoles("OWNER"),
  getOwnerStore
);

// ==================== GET STORE BY ID ====================
router.get(
  "/:id",
  authenticateToken,
  getStoreById
);

// ==================== CREATE STORE ====================
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createStore
);

// ==================== UPDATE STORE ====================
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateStore
);

// ==================== DELETE STORE ====================
// Only ADMIN can delete a store

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteStore
);

module.exports = router;