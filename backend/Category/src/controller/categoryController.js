const Category = require("../models/categoryModel.js");

// Tạo danh mục mới
exports.createCategory = async (req, res, next) => {
    try {
        const { categoryName, subCategories } = req.body;

        const newCategory = new Category({ categoryName, subCategories });
        await newCategory.save();

        res.status(201).json({ success: true, message: "Category created successfully", data: newCategory });
    } catch (error) {
        next(error);
    }
};

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

// Lấy chi tiết danh mục theo ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (category) {
            res.status(200).json({ success: true, data: category });
        } else {
            res.status(404).json({ success: false, message: "Category not found" });
        }
    } catch (error) {
        next(error);
    }
};

// Cập nhật danh mục theo ID
exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, { categoryName, updatedDate: Date.now() }, { new: true, runValidators: true });

        if (updatedCategory) {
            res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
        } else {
            res.status(404).json({ success: false, message: "Category not found" });
        }
    } catch (error) {
        next(error);
    }
};

// Xóa danh mục theo ID
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (deletedCategory) {
            res.status(200).json({ success: true, message: "Category deleted successfully", data: deletedCategory });
        } else {
            res.status(404).json({ success: false, message: "Category not found" });
        }
    } catch (error) {
        next(error);
    }
};
