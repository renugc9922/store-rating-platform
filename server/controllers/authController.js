const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// ==================== REGISTER USER ====================

const register = async (req, res) => {
  try {
    // Check validation errors from the route middleware
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg
      });
    }

    const { name, address, email, password } = req.body;

    // Public registration should only create normal users
    const role = "USER";

    // Check if the email is already registered
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const [result] = await pool.query(
      `INSERT INTO users (name, address, email, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, address, email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: result.insertId,
        name,
        address,
        email,
        role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the account"
    });
  }
};

// ==================== LOGIN USER ====================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user using their email
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    // Compare entered password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

   // Generate authentication token
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "24h"
  }
);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong while logging in"
    });
  }
};

// ==================== UPDATE PASSWORD ====================

const updatePassword = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get the logged-in user
    const [users] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    // Verify the current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save the new password
    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    return res.status(200).json({
      message: "Password updated successfully!"
    });
  } catch (error) {
    console.error("Password update error:", error);

    return res.status(500).json({
      message: "Something went wrong while updating the password"
    });
  }
};

module.exports = {
  register,
  login,
  updatePassword
};