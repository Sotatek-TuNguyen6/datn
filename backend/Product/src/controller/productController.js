const Product = require("../models/productModel")
const Joi = require("joi")
const logger = require('../utils/logger');
const redisClient = require("../utils/redisClient");
const { log } = require("winston");
const fs = require('fs');
const data = require("../../data.json")
const productSchema = Joi.object({
    productName: Joi.string().trim().required(),
    price: Joi.number().required(),
    priceSale: Joi.number(),
    description: Joi.string().trim(),
    images: Joi.array().items(Joi.string().uri()),
    mainImage: Joi.string().uri().required(),
    categoryId: Joi.string().required(),
    categoryName: Joi.string().required(),
    stockQuantity: Joi.number().min(0).required(),
    brand: Joi.string(),
    ratings: Joi.number().min(0).max(5),
    isActive: Joi.boolean(),
    subCategoryName: Joi.string(),
    specifications: Joi.array()
});

exports.createProduct = async (req, res, next) => {
    try {
        const { error, value } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const checkExitsProduct = await Product.findOne({ productName: value.productName });
        if (checkExitsProduct) {
            return res.status(400).json({ error: "Product already exists" });
        }

        const product = new Product(value);
        await product.save();
        logger.info("New product created:", product);
        await redisClient.del('products');

        res.status(201).json({ success: true, message: "Product created successfully", data: product });

    } catch (error) {
        next(error);
    }
};

exports.getAllProduct = async (req, res, next) => {
    try {
        const cachedProducts = await redisClient.get('products');
        if (cachedProducts) {
            const products = JSON.parse(cachedProducts);
            if (products.length > 0) {
                res.status(200).json({ success: true, data: products });
                logger.info("Retrieved all accounts from cache");
                return;
            }
        }

        const listProducts = await Product.find({})
        await redisClient.setEx('products', 5, JSON.stringify(listProducts));

        return res.status(200).json({ success: true, data: listProducts })
    } catch (error) {
        next(error)
    }
}

exports.getDetailProduct = async (req, res, next) => {
    try {
        const idParams = req.params.id;
        const findProduct = await Product.findById(idParams);

        if (findProduct) {
            res.status(200).json({ success: true, data: findProduct });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const idParams = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(idParams);

        if (deletedProduct) {
            await redisClient.del('products');
            res.status(200).json({ success: true, message: "Product deleted successfully", data: deletedProduct });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const idParams = req.params.id;

        const { error, value } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const updatedProduct = await Product.findByIdAndUpdate(idParams, value, { new: true, runValidators: true });

        if (updatedProduct) {
            await redisClient.del('products');
            res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        next(error);
    }
};

exports.importData = async (req, res, next) => {
    try {
        // fs.readFile(data, 'utf8', async (err, data) => {
        //     if (err) {
        //         return next(err);
        //     }

        //     try {
        //         const products = JSON.parse(data.data);

        //         const importedProducts = await Product.insertMany(products);

        //         logger.info(`${importedProducts.length} products imported successfully`);

        //         res.status(200).json({
        //             success: true,
        //             message: `${importedProducts.length} products imported successfully`,
        //             data: importedProducts
        //         });
        //     } catch (error) {
        //         next(error);
        //     }
        // });
        const products = data.data; // Assuming data is already parsed JSON object

        // Import the products into the database
        const importedProducts = await Product.insertMany(products);

        logger.info(`${importedProducts.length} products imported successfully`);

        res.status(200).json({
            success: true,
            message: `${importedProducts.length} products imported successfully`,
            data: importedProducts
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductByCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id
        // const cachedProducts = await redisClient.get('productByCategory');
        // if (cachedProducts) {
        //     const products = JSON.parse(cachedProducts);
        //     const dataNew = products.filter((item) => {
        //         return item.categoryId._id === categoryId
        //     })
        //     if (products.length > 0) {
        //         res.status(200).json({ success: true, data: dataNew });
        //         logger.info("Retrieved all accounts from cache");
        //         return;
        //     }
        //     else res.status(200).json({ success: true, data: [] });
        // }
        const listProducts = await Product.find({ categoryId: categoryId }).populate('categoryId').exec();
        // await redisClient.setEx('productByCategory', 5, JSON.stringify(listProducts));

        return res.status(200).json({ success: true, data: listProducts })
    } catch (error) {
        next(error)
    }
}


exports.updateStock = async (productId) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {},
            { new: true, runValidators: true }
        )

        if (updatedProduct) {
            await redisClient.del('products');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        next(error);
    }
};
