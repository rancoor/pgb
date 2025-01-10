const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://your-supabase-url.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'your-supabase-service-key'; // Replace with your Supabase service key

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to fetch data from the final_standings table
async function fetchFinalStandings() {
  try {
    // Query the final_standings table
    const { data, error } = await supabase
      .from('final_standings')
      .select('*'); // Fetch all columns. Modify as needed.

    if (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }

    // Log the fetched data
    console.log('Final Standings:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run the fetch function
fetchFinalStandings();
