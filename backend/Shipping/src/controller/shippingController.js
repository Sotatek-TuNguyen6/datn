// controllers/shippingController.js
const Shipping = require('../models/shippingModel');
const { publishToQueue, consumeQueue } = require('../utils/amqp');

// Create a new shipping record
exports.createShipping = async (req, res) => {
    try {
        const shipping = new Shipping(req.body);
        await shipping.save();
        res.status(201).send(shipping);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all shipping records
exports.getAllShippings = async (req, res) => {
    try {
        const shippings = await Shipping.find();

        await publishToQueue("order_info", shippings);

        // try {
        //     // const orderInfo = await consumeQueue('order_response');

        //     res.json("ok");
        // } catch (error) {
        //     console.error(`Error consuming user info response:`, error);
        //     throw error;
        // }

        res.json("ok");
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a single shipping record by ID
exports.getShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) {
            return res.status(404).send();
        }
        res.send(shipping);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a shipping record by ID
exports.updateShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!shipping) {
            return res.status(404).send();
        }
        res.send(shipping);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a shipping record by ID
exports.deleteShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findByIdAndDelete(req.params.id);
        if (!shipping) {
            return res.status(404).send();
        }
        res.send(shipping);
    } catch (error) {
        res.status(500).send(error);
    }
};
