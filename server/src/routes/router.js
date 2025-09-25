const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth/index');
const products = require('../controllers/products/index');
const master = require('../controllers/master/index');

router.use('/auth', auth);
router.use('/products', products);
router.use('/master', master);

module.exports = router;