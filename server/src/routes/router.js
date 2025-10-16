const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth/index');
const products = require('../controllers/products/index');
const master = require('../controllers/master/index');
const order = require('../controllers/orders/index');
const authMiddleware = require('../middleware/auth');


router.use('/auth', auth);
router.use('/products', products);
router.use('/master', master);
router.use('/orders', order);

router.get('/check', authMiddleware, (req, res) => {
  // If authMiddleware passes, user is authenticated
  res.json({ authenticated: true, user: req.user });
});

module.exports = router;