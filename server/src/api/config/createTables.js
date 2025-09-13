const pool = require('./db');

const createProductsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      model_number VARCHAR(255) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      resolution VARCHAR(50),
      lens_specification VARCHAR(255),
      poe_support BOOLEAN DEFAULT FALSE,
      night_vision BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('❌ Error creating products table:', err);
    } else {
      console.log('✅ Products table created successfully');
    }
  });
};

// Create tables when this file is imported
createProductsTable();

module.exports = { createProductsTable };
