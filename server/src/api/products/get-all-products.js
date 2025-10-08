const Product = require('../../models/Product');

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
module.exports = {getProducts};