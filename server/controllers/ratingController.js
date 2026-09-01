const pool = require("../config/db");

const createRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating) {
      return res.status(400).json({
        message: "Store ID and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const [stores] = await pool.query(
      "SELECT id FROM stores WHERE id = ?",
      [store_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    const [existingRatings] = await pool.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [user_id, store_id]
    );

    if (existingRatings.length > 0) {
      return res.status(400).json({
        message: "You have already rated this store"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)`,
      [user_id, store_id, rating]
    );

    return res.status(201).json({
      message: "Rating submitted successfully!",
      rating: {
        id: result.insertId,
        user_id,
        store_id,
        rating
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const getRatingsByStore = async (req, res) => {
  try {
    const { store_id } = req.params;

    const [stores] = await pool.query(
      "SELECT id, name FROM stores WHERE id = ?",
      [store_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

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
      [store_id]
    );

    return res.status(200).json({
      message: "Store ratings fetched successfully!",
      store: stores[0],
      ratings
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const user_id = req.user.id;

    if (!rating) {
      return res.status(400).json({
        message: "Rating is required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const [ratings] = await pool.query(
      "SELECT * FROM ratings WHERE id = ?",
      [id]
    );

    if (ratings.length === 0) {
      return res.status(404).json({
        message: "Rating not found"
      });
    }

    const existingRating = ratings[0];

    if (existingRating.user_id !== user_id) {
      return res.status(403).json({
        message: "You can only update your own rating"
      });
    }

    await pool.query(
      `UPDATE ratings
       SET rating = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [rating, id]
    );

    return res.status(200).json({
      message: "Rating updated successfully!",
      rating: {
        id: Number(id),
        user_id,
        store_id: existingRating.store_id,
        rating
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [ratings] = await pool.query(
      "SELECT * FROM ratings WHERE id = ?",
      [id]
    );

    if (ratings.length === 0) {
      return res.status(404).json({
        message: "Rating not found"
      });
    }

    const existingRating = ratings[0];

    if (existingRating.user_id !== user_id) {
      return res.status(403).json({
        message: "You can only delete your own rating"
      });
    }

    await pool.query(
      "DELETE FROM ratings WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      message: "Rating deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports = {
  createRating,
  getRatingsByStore,
  updateRating,
  deleteRating
};