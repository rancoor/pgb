const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

// Retrieve Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Check if environment variables are set
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in the environment variables.');
  process.exit(1);
}

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    // Fetch a list of rows from the 'final_standings' table
    const { data, error } = await supabase.from('final_standings').select('*').limit(1);

    if (error) {
      console.error('Error testing Supabase connection:', error.message);
    } else {
      console.log('Connection successful! Sample data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

// Run the test connection function
testConnection();
