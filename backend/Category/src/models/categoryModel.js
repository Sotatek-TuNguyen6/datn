const mongoose = require("mongoose")


const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        require: true,
        unique: true,
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
})

categorySchema.pre('save', function(next) {
    this.updatedDate = Date.now();
    next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;