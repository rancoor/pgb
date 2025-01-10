const postgres = require("postgres");

// Load environment variables
require("dotenv").config();

// Connection string for the PostgreSQL database
const connectionString = process.env.DATABASE_URL;

// Initialize the postgres client
const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Enable SSL for production
});

// Function to fetch data from the 'final_standings' table
async function fetchFinalStandings() {
  try {
    const standings = await sql`SELECT * FROM final_standings`;
    console.log("Final Standings:", standings);
  } catch (err) {
    console.error("Error fetching final standings:", err.message);
  }
}

// Run the fetch function if the script is executed directly
if (require.main === module) {
  fetchFinalStandings();
}

module.exports = sql;
