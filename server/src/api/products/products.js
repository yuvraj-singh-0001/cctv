const Product = require('../../models/Product');

// Add a new product
const addProduct = async (req, res) => {
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

  try {
    const doc = await Product.create({
      product_name: productName,
      model_number: modelNumber,
      brand,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      resolution: resolution || null,
      lens_specification: lensSpecification || null,
      poe_support: !!poeSupport,
      night_vision: !!nightVision,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      productId: doc._id
    });
  } catch (err) {
    console.error('Error adding product:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add product'
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const results = await Product.find({}).sort({ created_at: -1 });
    const formattedProducts = results.map(product => ({
      id: product._id,
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

    res.json({ success: true, products: formattedProducts });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Get products added today
const getTodayProducts = async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  try {
    const results = await Product.find({
      created_at: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ created_at: -1 });

    const formattedProducts = results.map(product => ({
      id: product._id,
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

    res.json({ success: true, products: formattedProducts });
  } catch (err) {
    console.error('Error fetching today\'s products:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch today\'s products' });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getTodayProducts
};
