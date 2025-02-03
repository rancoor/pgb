require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000; // You can use another safe port like 3000

// Supabase client setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// Middleware
app.use(express.json()); // To handle POST requests
app.use(express.static('public')); // Serve static files from the public folder

// Serve the root page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/supa.html'); // Serve the index.html file
});

// API for fetching products with pagination
app.get('/api/products', async (req, res) => {
  const { search, status, category, page = 1, limit = 20 } = req.query;

  const pageNumber = parseInt(page);
  const pageLimit = parseInt(limit);
  const offset = (pageNumber - 1) * pageLimit;

  console.log(`Fetching page ${pageNumber}, limit ${pageLimit}`);

  try {
    let query = supabase
      .from('released_products')  // Query from the releasedproducts table
      .select(`
          itemnumber,
          old_item_code,
          related_off_cut,
          related_fg,
          ardis_item_type,
          related_rm,
          min_stock,
          max_stock,
          duty_rate_in_percent,
          hs_code,
          production_warehouse,
          bomunitsymbol,
          costcalculationgroupid,
          costgroupid,
          defaultledgerdimensiondisplayvalue,
          defaultordertype,
          grossdepth,
          grossproductheight,
          grossproductwidth,
          inventoryunitsymbol,
          itemmodelgroupid,
          netproductweight,
          emhscode,
          primaryvendoraccountnumber,
          productcoveragegroupid,
          productgroupid,
          productionpoolid,
          productiontype,
          productnumber,
          productsearchname,
          productsubtype,
          producttype,
          purchasechargeproductgroupid,
          purchaseoverdeliverypercentage,
          purchasesalestaxitemgroupcode,
          purchasesupplementaryproductproductgroupid,
          purchaseunderdeliverypercentage,
          purchaseunitsymbol,
          salesunitsymbol,
          scaleindicator,
          searchname,
          serialnumbergroupcode,
          servicetype,
          shelflifeperioddays,
          storagedimensiongroupname,
          tareproductweight,
          taxratetype,
          trackingdimensiongroupname,
          voyagearrivalgroupid,
          category_level_1,
          category_level_2,
          category_level_3,
          category_level_4,
          qms_item_groups
        )
      `)
      .range(offset, offset + pageLimit - 1);  // Pagination (offset and limit)

    // Log the constructed query for debugging
    console.log('Fetched Data:', query.data);  // Check the data structure

    // Applying filters if provided
    if (search) {
      console.log(`Applying search filter: ${search}`);
      query = query.ilike('name', `%${search}%`);
    }

    if (status) {
      console.log(`Applying status filter: ${status}`);
      query = query.eq('status', status);
    }

    if (category) {
      console.log(`Applying category filter: ${category}`);
      query = query.eq('released_products.category', category);
    }

    // Execute the query and get the count
    const { data, error, count } = await query;

    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ error: 'Error fetching products' });
    }

    console.log(`Fetched ${data.length} items`);

    // Send the response with pagination metadata and the queried data
    res.json({
      data,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageLimit,
        totalPages: Math.ceil(count / pageLimit),
        totalItems: count
      }
    });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API for updating product data (both products and released_products)
app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  const { name, old_item_code, status, dimensions, category, uom } = req.body;

  try {
    // Update the products table
    await supabase.from('products').update({ name, old_item_code, status }).eq('id', id);
    // Update the released_products table
    await supabase.from('released_products').update({ dimensions, category, uom }).eq('old_item_code', id);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
