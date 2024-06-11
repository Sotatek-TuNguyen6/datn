const Review = require('../models/reviewModel');


// Create a new review
exports.createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                review
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: reviews
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

// Get a single review by ID
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: review
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Review not found'
        });
    }
};

// Update a review by ID
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: review
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Review not found'
        });
    }
};
