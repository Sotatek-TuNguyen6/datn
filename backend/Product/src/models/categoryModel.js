const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true,
        trim: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    }
});

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    subCategories: [subCategorySchema],
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    }
});

categorySchema.pre('save', function(next) {
    this.updatedDate = Date.now();
    next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
