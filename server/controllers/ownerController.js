const pool = require("../config/db");

// ==================== GET OWNER'S STORE ====================
const getOwnerStore = async (req, res) => {
  try {
    // Logged-in user's ID from JWT
    const ownerId = req.user.id;

    const [stores] = await pool.query(
      `SELECT id, name, email, address, owner_id, created_at
       FROM stores
       WHERE owner_id = ?`,
      [ownerId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "No store found for this owner"
      });
    }

    return res.status(200).json({
      message: "Owner store fetched successfully!",
      stores
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

// ==================== GET OWNER STORE RATINGS ====================
const getOwnerStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await pool.query(
      `SELECT id, name, email, address, owner_id, created_at
       FROM stores
       WHERE owner_id = ?
       ORDER BY created_at DESC`,
      [ownerId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "No store found for this owner"
      });
    }

    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const [ratings] = await pool.query(
          `SELECT
            ratings.id,
            ratings.user_id,
            users.name AS user_name,
            ratings.rating,
            ratings.created_at
           FROM ratings
           JOIN users ON ratings.user_id = users.id
           WHERE ratings.store_id = ?
           ORDER BY ratings.created_at DESC`,
          [store.id]
        );

        const [averageResult] = await pool.query(
          `SELECT ROUND(AVG(rating), 2) AS average_rating
           FROM ratings
           WHERE store_id = ?`,
          [store.id]
        );

        return {
          ...store,
          average_rating: averageResult[0].average_rating,
          ratings
        };
      })
    );

    return res.status(200).json({
      message: "Owner store ratings fetched successfully!",
      stores: storesWithRatings
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports = {
  getOwnerStore,
  getOwnerStoreRatings
};  