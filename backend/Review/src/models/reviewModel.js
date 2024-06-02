const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    product: {
        type: "string",
        required: true
    },
    author: {
        type: "string",
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);
