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

module.exports = {addProduct};
