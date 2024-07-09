const { consumeQueue, publishToQueue } = require('../utils/amqp');
const Product = require('../models/productModel');
const logger = require('../utils/logger');
const amqp = require('amqplib');

async function handleProductDetailsRequest({ productId }) {
  try {
    logger.info("Handling product details request for productId:", productId);
    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new Error('Product not found');
    }

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('productDetailsResponseQueue', { durable: true });
    channel.sendToQueue('productDetailsResponseQueue', Buffer.from(JSON.stringify(product)));
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error('Error handling product details request:', error);
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

// consumeQueue('productRequestQueue', handleProductGetAll);
// consumeQueue('productDetailsRequestQueue', handleProductDetailsRequest);
logger.info("Consumer for productDetailsRequestQueue has started.");


module.exports = { checkQuantityStock }