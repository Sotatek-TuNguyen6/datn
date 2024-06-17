const { consumeQueue, publishToQueue } = require('../utils/amqp');
const Account = require('../models/AcountModels');
const logger = require('../utils/logger');
const amqp = require('amqplib');

async function handleProductDetailsRequest({ userId }) {
    try {
        logger.info("Handling product details request for productId:", userId);
        const account = await Account.findById(userId).select('id name').lean();
        if (!account) {
            throw new Error('Account not found');
        }

        await publishToQueue('user-info-response', account);
        logger.info('successfully:', account);
    } catch (error) {
        logger.error('Error handling product details request:', error);
    }
}

console.log("vao day r")
// Ensure the consumer starts
consumeQueue('user-info-request', handleProductDetailsRequest);
logger.info("Consumer for productDetailsRequestQueue has started.");
