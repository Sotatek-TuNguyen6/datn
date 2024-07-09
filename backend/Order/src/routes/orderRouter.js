const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController'); // Adjust the path as needed
const { protect } = require('../middleware/AuthMiddleware');

// Get all orders

router.get("/vnpay_return", protect, orderController.returnPayment)
router.get("/vnpay_ipn", orderController.inpPayment)

router.get('/', orderController.getAllOrders);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Create a new order
router.post('/', orderController.createOrder);

// Update an existing order by ID
router.put('/:id', orderController.updateOrderById);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrderById);


module.exports = router;
