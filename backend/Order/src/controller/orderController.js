const Order = require('../model/orderModel'); // Adjust the path as needed
const logger = require('../utils/logger'); // Adjust the path as needed

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const cachedOrders = await redisClient.get('orders');
        if (cachedOrders) {
            const orders = JSON.parse(cachedOrders);
            res.status(200).json(orders);
            logger.info("Retrieved all orders from cache");
            return;
        }

        const orders = await Order.find();
        await redisClient.set('orders', JSON.stringify(orders));

        res.status(200).json(orders);
        logger.info("Retrieved all orders from database:", orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
        logger.error("Error retrieving orders:", error);
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error: error.message });
        logger.error("Error retrieving order:", error);
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();

        // Invalidate cache
        await redisClient.del('orders');

        res.status(201).json(savedOrder);
        logger.info("Created new order:", savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
        logger.error("Error creating order:", error);
    }
};

// Update an existing order by ID
exports.updateOrderById = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        // Invalidate cache
        await redisClient.del('orders');

        res.status(200).json(updatedOrder);
        logger.info("Updated order:", updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
        logger.error("Error updating order:", error);
    }
};

// Delete an order by ID
exports.deleteOrderById = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        // Invalidate cache
        await redisClient.del('orders');

        res.status(200).json({ message: "Order deleted successfully" });
        logger.info("Deleted order:", deletedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
        logger.error("Error deleting order:", error);
    }
};
