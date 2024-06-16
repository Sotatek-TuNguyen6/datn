const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    actionType: { type: String, enum: ['watching', 'add_to_cart', 'purchase'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Action', ActionSchema);
