const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// Initialize a connection pool using the DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for secure connections in production
  },
});

console.log(pool.connectionString);

// Test the connection to the database
async function testConnection() {
  try {
    const client = await pool.connect(); // Get a connection from the pool
    const res = await client.query("SELECT NOW() AS current_time"); // Test query
    console.log("Connected to the database. Current time:", res.rows[0].current_time);
    client.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  } finally {
    // Close the pool when done
    await pool.end();
  }
}

// Run the test connection
testConnection();
