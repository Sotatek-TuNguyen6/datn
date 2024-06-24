const express = require('express');
const router = express.Router();
const orderController = require('../controller/voucherController'); // Adjust the path as needed

// Get all orders
router.get('/', orderController.getAllVouchers);

// Get a single order by ID
router.get('/:id', orderController.createVoucher);

// Create a new order
router.post('/', orderController.createOrder);

// Update an existing order by ID
router.put('/:id', orderController.updateOrderById);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrderById);

module.exports = router;
