const { consumeQueue, publishToQueue, consumeQueueV2 } = require('../utils/amqp');
const Product = require('../models/productModel');
const logger = require('../utils/logger');
const amqp = require('amqplib');
const { default: mongoose } = require('mongoose');

async function handleProductDetailsRequest({ productIds }) {
  try {
    if (!productIds || productIds.length === 0) {
      logger.warn("No productIds provided");
      return [];
    }

    // Filter out any invalid product IDs
    const validProductIds = productIds.filter(productId => productId && mongoose.Types.ObjectId.isValid(productId));

    if (validProductIds.length === 0) {
      logger.warn("No valid productIds provided");
      return [];
    }

    logger.info("Handling product details request for valid productIds:", validProductIds);
    
    // Fetch products from the database
    const products = await Product.find({ _id: { $in: validProductIds } })
      .select("-description")
      .lean();

    if (!products || products.length === 0) {
      logger.warn("No products found for the provided productIds");
      return [];
    }

    return products;
  } catch (error) {
    logger.error('Error handling product details request:', { message: error.message, stack: error.stack });
    throw error; // Re-throw the error to be handled by the calling function
  }
}
async function handleProductGetAll(msg) {
  try {
    logger.info("Handling product request");
    const products = await Product.find().lean();
    if (!products) {
      throw new Error('Products not found');
    }
    console.log("Products found:", products); // Log the products foun

    const response = {
      products: products
    };

    await publishToQueue('productResponseQueue', response);
    console.log("Message sent to response queue"); // Log after sending the message
  } catch (error) {
    logger.error('Error handling product details request:', error);
  }
}

const checkQuantityStock = async (products) => {
  try {
    const productIds = products.map(product => product.productId);
    const quantities = products.map(product => product.quantity);

    const productCheck = await Product.find({ _id: { $in: productIds } });

    for (let i = 0; i < products.length; i++) {
      const productId = productIds[i];
      const quantityRequired = quantities[i];
      const product = productCheck.find(p => p._id.toString() === productId.toString());

      if (!product || product.stock < quantityRequired) {
        return false;
      }
    }

    return true;
  } catch (error) {
    logger.error('Error checking product stock: ' + error.message);
    return false;
  }
};
// Ensure the consumer starts

consumeQueue('productRequestQueue', handleProductGetAll);
consumeQueueV2('productDetailsRequestQueue', handleProductDetailsRequest);
logger.info("Consumer for productDetailsRequestQueue has started.");


module.exports = { checkQuantityStock }