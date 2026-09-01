const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg
      });
    }

    const { name, address, email, password, role } = req.body;

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name, address, email, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, address, email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User created successfully!",
      user: {
        id: result.insertId,
        name,
        address,
        email,
        role
      }
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    return res.status(500).json({
      message: "Something went wrong while creating the user"
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [usersResult] = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [storesResult] = await pool.query(
      "SELECT COUNT(*) AS total_stores FROM stores"
    );

    const [ratingsResult] = await pool.query(
      "SELECT COUNT(*) AS total_ratings FROM ratings"
    );

    return res.status(200).json({
      message: "Admin dashboard statistics fetched successfully!",
      statistics: {
        total_users: usersResult[0].total_users,
        total_stores: storesResult[0].total_stores,
        total_ratings: ratingsResult[0].total_ratings
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "id",
      order = "asc"
    } = req.query;

    let query = `
      SELECT id, name, address, email, role, created_at
      FROM users
      WHERE 1 = 1
    `;

    const values = [];

    if (name) {
      query += " AND name LIKE ?";
      values.push(`%${name}%`);
    }

    if (email) {
      query += " AND email LIKE ?";
      values.push(`%${email}%`);
    }

    if (address) {
      query += " AND address LIKE ?";
      values.push(`%${address}%`);
    }

    if (role) {
      query += " AND role = ?";
      values.push(role.toUpperCase());
    }

    const allowedSortFields = [
      "id",
      "name",
      "email",
      "address",
      "role",
      "created_at"
    ];

    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "id";

    const validOrder = order.toLowerCase() === "desc"
      ? "DESC"
      : "ASC";

    query += ` ORDER BY ${validSortBy} ${validOrder}`;

    const [users] = await pool.query(query, values);

    return res.status(200).json({
      message: "Users fetched successfully!",
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getAllStoresWithRatings = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "id",
      order = "asc"
    } = req.query;

    let query = `
      SELECT
        stores.id,
        stores.name,
        stores.email,
        stores.address,
        stores.owner_id,
        stores.created_at,
        users.name AS owner_name,
        ROUND(AVG(ratings.rating), 2) AS average_rating
      FROM stores
      JOIN users ON stores.owner_id = users.id
      LEFT JOIN ratings ON stores.id = ratings.store_id
      WHERE 1 = 1
    `;

    const values = [];

    if (name) {
      query += " AND stores.name LIKE ?";
      values.push(`%${name}%`);
    }

    if (email) {
      query += " AND stores.email LIKE ?";
      values.push(`%${email}%`);
    }

    if (address) {
      query += " AND stores.address LIKE ?";
      values.push(`%${address}%`);
    }

    const allowedSortFields = [
      "id",
      "name",
      "email",
      "address",
      "average_rating",
      "created_at"
    ];

    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "id";

    const validOrder = order && order.toLowerCase() === "desc"
      ? "DESC"
      : "ASC";

    query += `
      GROUP BY
        stores.id,
        stores.name,
        stores.email,
        stores.address,
        stores.owner_id,
        stores.created_at,
        users.name
      ORDER BY ${validSortBy} ${validOrder}
    `;

    const [stores] = await pool.query(query, values);

    return res.status(200).json({
      message: "Stores with ratings fetched successfully!",
      stores
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      `SELECT id, name, email, address, role, created_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    if (user.role === "OWNER") {
      const [stores] = await pool.query(
        `SELECT
          stores.id,
          stores.name,
          AVG(ratings.rating) AS average_rating
         FROM stores
         LEFT JOIN ratings
           ON stores.id = ratings.store_id
         WHERE stores.owner_id = ?
         GROUP BY stores.id, stores.name`,
        [id]
      );

      user.stores = stores;
    }

    return res.status(200).json({
      message: "User details fetched successfully!",
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports = {
  createUser,
  getDashboardStats,
  getAllUsers,
  getAllStoresWithRatings,
  getUserById
};
