const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth/index');
const products = require('../controllers/products/index');

router.use('/auth', auth);
router.use('/products', products);

module.exports = router;