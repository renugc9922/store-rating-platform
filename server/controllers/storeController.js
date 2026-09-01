const pool = require("../config/db");

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({
        message: "Name, email, address, and owner_id are required"
      });
    }

    const [existingStores] = await pool.query(
      "SELECT id FROM stores WHERE email = ?",
      [email]
    );

    if (existingStores.length > 0) {
      return res.status(400).json({
        message: "A store with this email already exists"
      });
    }

    const [owners] = await pool.query(
      "SELECT id FROM users WHERE id = ? AND role = 'OWNER'",
      [owner_id]
    );

    if (owners.length === 0) {
      return res.status(400).json({
        message: "Invalid owner. Please provide a valid user with OWNER role"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, address, owner_id]
    );

    return res.status(201).json({
      message: "Store created successfully!",
      store: {
        id: result.insertId,
        name,
        email,
        address,
        owner_id
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const user_id = req.user.id;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at,

        ROUND(AVG(r.rating), 2) AS average_rating,

        (
          SELECT id
          FROM ratings
          WHERE store_id = s.id
          AND user_id = ?
        ) AS user_rating_id,

        (
          SELECT rating
          FROM ratings
          WHERE store_id = s.id
          AND user_id = ?
        ) AS user_rating

      FROM stores s

      LEFT JOIN ratings r
        ON s.id = r.store_id

      WHERE 1 = 1
    `;

    const values = [user_id, user_id];

    if (name) {
      query += " AND s.name LIKE ?";
      values.push(`%${name}%`);
    }

    if (address) {
      query += " AND s.address LIKE ?";
      values.push(`%${address}%`);
    }

    query += `
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at
    `;

    const [stores] = await pool.query(query, values);

    return res.status(200).json({
      message: "Stores fetched successfully!",
      stores
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const [stores] = await pool.query(
      `SELECT id, name, email, address, owner_id, created_at
       FROM stores
       WHERE id = ?`,
      [id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    return res.status(200).json({
      message: "Store fetched successfully!",
      store: stores[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    const [existingStores] = await pool.query(
      "SELECT * FROM stores WHERE id = ?",
      [id]
    );

    if (existingStores.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    const [owners] = await pool.query(
      "SELECT id FROM users WHERE id = ? AND role = 'OWNER'",
      [owner_id]
    );

    if (owners.length === 0) {
      return res.status(400).json({
        message: "Invalid owner. Please provide a valid user with OWNER role"
      });
    }

    await pool.query(
      `UPDATE stores
       SET name = ?, email = ?, address = ?, owner_id = ?
       WHERE id = ?`,
      [name, email, address, owner_id, id]
    );

    return res.status(200).json({
      message: "Store updated successfully!",
      store: {
        id: Number(id),
        name,
        email,
        address,
        owner_id
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const [stores] = await pool.query(
      "SELECT id FROM stores WHERE id = ?",
      [id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    await pool.query(
      "DELETE FROM stores WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      message: "Store deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getOwnerStore = async (req, res) => {
  try {
    const owner_id = req.user.id;

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
      [owner_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "No store found for this owner"
      });
    }

    return res.status(200).json({
      message: "Owner store fetched successfully!",
      store: stores[0]
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  getOwnerStore,
  updateStore,
  deleteStore
};