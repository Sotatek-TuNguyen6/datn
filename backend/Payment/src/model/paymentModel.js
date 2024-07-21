const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refund'],
        default: 'pending'
    },
    paymentInfo: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
