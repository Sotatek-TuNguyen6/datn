const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    actionType: { type: String, enum: ['click', 'add_to_cart', 'purchase', 'rating'], required: true },
    rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Action', ActionSchema);
