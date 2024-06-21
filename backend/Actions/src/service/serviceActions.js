const { consumeQueue, publishToQueue } = require('../utils/amqp');
const Action = require('../model/actionModel');
const logger = require('../utils/logger');

async function handleActionsGetAll(msg) {
    try {
        logger.info("Handling actions request");
        const actions = await Action.find().lean();
        if (!actions) {
            throw new Error('actions not found');
        }

        const response = {
            actions: actions
        };

        await publishToQueue('actionsResponseQueue', response);
        console.log("Message sent to response queue");
    } catch (error) {
        logger.error('Error handling actions request:', error);
    }
}

// Ensure the consumer starts

consumeQueue('actionsRequestQueue', handleActionsGetAll);
logger.info("Consumer for actionsRequestQueue has started.");
