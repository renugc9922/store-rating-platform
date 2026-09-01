const pool = require("../config/db");

// ==================== GET ALL USERS + FILTERS + SORTING ====================
const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    let query = `
      SELECT id, name, address, email, role, created_at
      FROM users
      WHERE 1 = 1
    `;

    const values = [];

    // ==================== FILTERS ====================

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
      values.push(role);
    }

    // ==================== SORTING ====================

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

    const validOrder =
      order && order.toUpperCase() === "DESC"
        ? "DESC"
        : "ASC";

    query += ` ORDER BY ${validSortBy} ${validOrder}`;

    const [users] = await pool.query(query, values);

    return res.status(200).json({
      message: "Users fetched successfully!",
      users
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};


// ==================== GET USER BY ID ====================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user details
    const [users] = await pool.query(
      `SELECT id, name, address, email, role, created_at
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

    // ====================
    // IF USER IS STORE OWNER
    // GET THEIR STORE + AVERAGE RATING
    // ====================

    if (user.role === "OWNER") {
      const [stores] = await pool.query(
        `
        SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id,
          s.created_at,
          ROUND(AVG(r.rating), 2) AS average_rating

        FROM stores s

        LEFT JOIN ratings r
          ON s.id = r.store_id

        WHERE s.owner_id = ?

        GROUP BY
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id,
          s.created_at
        `,
        [id]
      );

      user.stores = stores;
    }

    return res.status(200).json({
      message: "User fetched successfully!",
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};


module.exports = {
  getAllUsers,
  getUserById
};