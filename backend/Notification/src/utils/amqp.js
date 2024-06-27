const amqp = require('amqplib');
const logger = require('./logger');
const sendEmail = require('../service/sendMail');
const Notification = require('../models/NotificationModel');

async function publishToExchange(exchangeName, routingKey, message) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
    logger.info(`Message sent to exchange: ${exchangeName} with routingKey: ${routingKey}`, { message });
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`Error publishing to exchange: ${exchangeName}`, { error: error.message });
  }
}

async function consumeFromExchange(exchangeName, queueName, bindingKey) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, bindingKey);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        logger.info(`Message received from exchange: ${exchangeName} with routingKey: ${bindingKey}`, { messageContent });
        const dataNew = {
          userId: messageContent.recipientEmail._id,
          message: 'test',
          status: 'sent',
          sentAt: new Date()
        }
        const notification = new Notification(dataNew);
        await notification.save();
        channel.ack(msg);
        logger.info('Notification saved to DB', { notification });

        // Phân loại thông điệp và thực hiện hành động tương ứng
        if (messageContent.type === 'email') {
          sendEmail(notification, messageContent.recipientEmail.email);
        } 
      }
    }, { noAck: false });

    logger.info(`Started consuming from exchange: ${exchangeName} with bindingKey: ${bindingKey}`);
  } catch (error) {
    logger.error(`Error consuming from exchange: ${exchangeName}`, { error: error.message });
    throw error;
  }
}

module.exports = { publishToExchange, consumeFromExchange };
