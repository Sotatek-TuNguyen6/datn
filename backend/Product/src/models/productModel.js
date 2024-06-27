const req = require("express/lib/request");
const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    priceSale: {
        type: Number,
    },
    description: {
        type: String,
        trim: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    ratings: {
        type: Number,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5'],
    },
    images: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10']
    },
    mainImage: {
        type: String,
        required: true,
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: [0, 'Stock quantity cannot be less than 0'],
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Category'
    },
    subCategoryName:{
        type: String,
        require: true
    },
    brand: {
        type: String,
        // trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    type:{
        type: String,
    },
    specifications: {
        type: [String],
        default: []
    }
})

function arrayLimit(val) {
    return val.length <= 10;
}
const Product = mongoose.model("Product", productSchema);

module.exports = Product;