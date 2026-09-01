require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

// server/server.js
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Check MySQL database connection
    await pool.query("SELECT 1");

    console.log("MySQL Database Connected Successfully!");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

startServer();