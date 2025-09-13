const pool = require('../config/db');

// Add a new product
const addProduct = (req, res) => {
  const {
    productName,
    modelNumber,
    brand,
    category,
    price,
    quantity,
    resolution,
    lensSpecification,
    poeSupport,
    nightVision
  } = req.body;

  // Validate required fields
  if (!productName || !modelNumber || !brand || !category || !price || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: productName, modelNumber, brand, category, price, quantity'
    });
  }

  const insertQuery = `
    INSERT INTO products (
      product_name, model_number, brand, category, price, quantity,
      resolution, lens_specification, poe_support, night_vision
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    productName,
    modelNumber,
    brand,
    category,
    parseFloat(price),
    parseInt(quantity),
    resolution || null,
    lensSpecification || null,
    poeSupport || false,
    nightVision || false
  ];

  pool.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add product'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      productId: result.insertId
    });
  });
};

// Get all products
const getProducts = (req, res) => {
  const selectQuery = `
    SELECT 
      id,
      product_name,
      model_number,
      brand,
      category,
      price,
      quantity,
      resolution,
      lens_specification,
      poe_support,
      night_vision,
      created_at,
      updated_at
    FROM products 
    ORDER BY created_at DESC
  `;

  pool.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products'
      });
    }

    // Format the data for frontend
    const formattedProducts = results.map(product => ({
      id: product.id,
      name: product.product_name,
      modelNumber: product.model_number,
      brand: product.brand,
      category: product.category,
      price: parseFloat(product.price),
      stock: product.quantity,
      resolution: product.resolution,
      lensSpecification: product.lens_specification,
      poeSupport: product.poe_support,
      nightVision: product.night_vision,
      addedTime: new Date(product.created_at).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).replace(',', ' at'),
      status: product.quantity < 5 ? 'Low Stock' : 'In Stock'
    }));

    res.json({
      success: true,
      products: formattedProducts
    });
  });
};

// Get products added today
const getTodayProducts = (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const selectQuery = `
    SELECT 
      id,
      product_name,
      model_number,
      brand,
      category,
      price,
      quantity,
      resolution,
      lens_specification,
      poe_support,
      night_vision,
      created_at,
      updated_at
    FROM products 
    WHERE created_at >= ? AND created_at < ?
    ORDER BY created_at DESC
  `;

  pool.query(selectQuery, [startOfDay, endOfDay], (err, results) => {
    if (err) {
      console.error('Error fetching today\'s products:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch today\'s products'
      });
    }

    // Format the data for frontend
    const formattedProducts = results.map(product => ({
      id: product.id,
      name: product.product_name,
      modelNumber: product.model_number,
      brand: product.brand,
      category: product.category,
      price: parseFloat(product.price),
      stock: product.quantity,
      resolution: product.resolution,
      lensSpecification: product.lens_specification,
      poeSupport: product.poe_support,
      nightVision: product.night_vision,
      addedTime: new Date(product.created_at).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).replace(',', ' at'),
      status: product.quantity < 5 ? 'Low Stock' : 'In Stock'
    }));

    res.json({
      success: true,
      products: formattedProducts
    });
  });
};

module.exports = {
  addProduct,
  getProducts,
  getTodayProducts
};
