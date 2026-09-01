const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== ROUTES ====================

// Authentication
app.use("/api/auth", authRoutes);

// Stores
app.use("/api/stores", storeRoutes);

// Ratings
app.use("/api/ratings", ratingRoutes);

// Store Owner
app.use("/api/owner", ownerRoutes);

// Administrator
app.use("/api/admin", adminRoutes);

// Users
app.use("/api/users", userRoutes);

module.exports = app;