// controllers/shippingController.js
const Shipping = require('../models/shippingModel');
const { publishToQueue, consumeQueue, consumeQueuev2, publishToExchange, consumeFromExchange, publishToQueueV2 } = require('../utils/amqp');

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
        const { id, role } = req.user;
        let shipping = [];
        if (role == "admin") {
            shipping = await Shipping.find();
        }
        else shipping = await Shipping.find({ userId: id })

        if (shipping.length == 0) {
            return res.json([])
        }
        // await publishToQueue("order-request", shipping);

        // try {
        //     // const orderInfo = await new Promise((resolve, reject) => {
        //     //     consumeFromExchange("orderResponse", 'orderResponseQueue', 'order_response', (message) => {
        //     //         resolve(message);
        //     //     }).catch(reject);
        //     // });
        //     const orderInfo = await consumeQueuev2("order-response")
        //     res.json(orderInfo);

        // } catch (error) {
        //     console.error(`Error consuming user info response:`, error);
        //     // res.json([]);
        // }
        await publishToQueueV2("order-request", shipping, async (orderInfo) => {
            res.json(orderInfo);
        });
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
        const { id, role } = req.user;

        let shipping;
        if (role === "admin") {
            shipping = await Shipping.findByIdAndDelete(req.params.id);
        } else {
            shipping = await Shipping.findOneAndDelete({ _id: req.params.id, userId: id });
        }

        if (!shipping) {
            return res.status(404).send({ message: "Shipping not found or you do not have permission to delete it." });
        }

        const { orderId } = shipping;
        await publishToExchange("deleteShipping", "delete_shipping", { orderId });

        res.send(shipping);
    } catch (error) {
        res.status(500).send(error);
    }
};