const Payment = require('../model/paymentModel');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({
            status: 'success',
            data: payment
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: payments
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get a single payment by ID
exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: payment

        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Payment not found'
        });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: payment
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Payment not found'
        });
    }
};
