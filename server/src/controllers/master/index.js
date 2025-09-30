const express = require('express');
const router = express.Router();

const { getSuppliers } = require('../../api/master/supplier/get-supplier');
const { addSupplier } = require('../../api/master/supplier/post-supplier');

// GET suppliers
router.get('/supplier/get-supplier', getSuppliers);

// POST supplier
router.post('/supplier/add', addSupplier);

module.exports = router;
