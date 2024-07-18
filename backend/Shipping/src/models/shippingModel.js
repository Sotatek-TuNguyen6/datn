const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Shipping', ShippingSchema);
