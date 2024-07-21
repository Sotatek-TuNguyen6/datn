const { consumeQueue, publishToQueue } = require('../utils/amqp');
const Account = require('../models/AcountModels');
const logger = require('../utils/logger');
const amqp = require('amqplib');

async function handleAccountRequest({ userIds }) {
    try {
        logger.info(`Handling account details request for userIds: ${userIds.join(', ')}`);

        const accounts = await Account.find({ _id: { $in: userIds } }).select('id name').lean();
        
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found for the provided userIds');
        }

        await publishToQueue('user-info-response', { accounts });
        logger.info('Account details published successfully:', accounts);
        
    } catch (error) {
        logger.error('Error handling account details request:', error);
    }
}

// Ensure the consumer starts
consumeQueue('user-info-request', handleAccountRequest);
logger.info("Consumer for productDetailsRequestQueue has started.");
