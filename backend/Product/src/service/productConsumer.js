const { consumeQueue } = require('../utils/amqp');
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

console.log("vao day r")
// Ensure the consumer starts
consumeQueue('productDetailsRequestQueue', handleProductDetailsRequest);
logger.info("Consumer for productDetailsRequestQueue has started.");
