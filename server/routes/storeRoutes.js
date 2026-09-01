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

router.get(
  "/",
  authenticateToken,
  getAllStores
);

router.get(
  "/my-store",
  authenticateToken,
  authorizeRoles("OWNER"),
  getOwnerStore
);

router.get(
  "/:id",
  authenticateToken,
  getStoreById
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createStore
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateStore
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteStore
);

module.exports = router;