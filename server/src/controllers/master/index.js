const express = require('express');
const router = express.Router();

const { getSuppliers } = require('../../api/master/supplier/get-supplier');
const { addSupplier } = require('../../api/master/supplier/post-supplier');
const { editSupplier } = require('../../api/master/supplier/edit-supplier');
const { deleteSupplier } = require('../../api/master/supplier/delete-supplier');

// GET suppliers
router.get('/supplier/get-supplier', getSuppliers);

// POST supplier
router.post('/supplier/add', addSupplier);

// PUT supplier
router.put('/supplier/edit/:id', editSupplier);

// DELETE supplier
router.delete('/supplier/delete/:id', deleteSupplier);

module.exports = router;
