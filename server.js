require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseApiKey);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/supa.html');
});

// API endpoint for fetching products
app.get('/api/products', async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) {
      query = query.eq('product_status', status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      data,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).json({ error: 'Error loading products' });
  }
});


// Serve public directory for frontend
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
