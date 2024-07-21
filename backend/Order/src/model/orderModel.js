const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },
        mainImage: {
            type: String,
            required: true,
        },
    }],
    status: {
        type: String,
        enum: ['created', 'inventory_reserved', 'inventory_reservation_failed', 'payment_completed', 'payment_failed', 'cancelled'],
        default: 'created'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);
