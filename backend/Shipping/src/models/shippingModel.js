const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
    origin: { type: String, default: "Đản Mỗ Uy Nỗ Đông Anh Hà Nội" },
    destination: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
    orderId: { type: String },
    userId: { type: String }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Shipping', ShippingSchema);
