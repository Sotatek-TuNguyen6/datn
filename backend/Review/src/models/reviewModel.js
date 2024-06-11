const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true
    // },
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
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);
