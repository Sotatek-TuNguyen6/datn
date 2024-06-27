const { consumeQueue, publishToQueue, consumeFromExchange, publishToExchange } = require('../utils/amqp');
const Account = require('../models/AcountModels');
const logger = require('../utils/logger');
const amqp = require('amqplib');

async function handleUserDetailRequest(messageContent) {
    try {
      const user = await User.findById(messageContent.userId);
      if (user) {
        logger.info('User found:', user);
        // Gửi thông tin người dùng về Order Service qua RabbitMQ
        const responseMessage = {
          userId: user._id,
          username: user.username,
          email: user.email,
          name: user.name
        };
        await publishToExchange('order_exchange', 'user_queue', responseMessage);
      } else {
        logger.warn('User not found for ID:', messageContent.userId);
        // Gửi thông điệp lỗi về Order Service nếu người dùng không tìm thấy
        await publishToExchange('order_exchange', 'user_queue', { error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error handling user detail request:', error);
      // Gửi thông điệp lỗi về Order Service nếu xảy ra lỗi
      await publishToExchange('order_exchange', 'user_queue', { error: 'Internal server error' });
    }
  }
// Ensure the consumer starts
consumeFromExchange('user_exchange', 'user_detail', 'user.detail', handleUserDetailRequest);
logger.info("Consumer for productDetailsRequestQueue has started.");
