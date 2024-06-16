const amqp = require('amqplib');
const Order = require("../model/orderModel");
const { consumeQueue, publishToQueue } = require('../utils/amqp');
const logger = require('../utils/logger');

async function handleCreateOrderRequest({ userId, products }) {
    try {
        if (userId && products) {
            const newOrder = new Order({
                userId: userId,
                products: products,
                status: 'Pending',
                createdAt: new Date(),
            });

            const savedOrder = await newOrder.save();
            await publishToQueue('orderCreateResponseQueue', {
                orderId: savedOrder._id,
            });
            logger.info('Order created successfully:', newOrder);
        }
        logger.info('Start!!', {});
    } catch (error) {
        logger.error('Error handling create order request:', error);
    }
}

consumeQueue('orderCreateRequestQueue', handleCreateOrderRequest);
logger.info("Consumer for orderCreateRequestQueue has started.");
