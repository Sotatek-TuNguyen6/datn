const amqp = require('amqplib');
const Order = require("../model/orderModel");
const logger = require('../utils/logger');

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

async function consumeFromExchange(exchangeName, routingKey, queueName, messageHandler) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    const q = await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(q.queue, exchangeName, routingKey);

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        messageHandler(messageContent);
        channel.ack(msg);
        logger.info(`Message received from exchange: ${exchangeName} with routingKey: ${routingKey}`, { message: messageContent });
      }
    });

    logger.info(`Waiting for messages in queue: ${queueName} with routingKey: ${routingKey}`);
  } catch (error) {
    logger.error(`Error consuming from exchange: ${exchangeName}`, { error: error.message });
  }
}

async function handleCreateOrderRequest({ userId, products, amount, emailUser }) {
  try {
    if (userId && products) {
      const newOrder = new Order({
        userId: userId,
        products: products,
        status: 'Pending',
        createdAt: new Date(),
      });

      const savedOrder = await newOrder.save();

      const responseMessage = {
        orderId: savedOrder._id,
        type: "orderSuccess",
        products,
        userId,
        amount,
        emailUser,
      };
      await publishToExchange('orderExchange', 'order.create.response', responseMessage);

    //   logger.info('Order created successfully:', newOrder);
    }
    logger.info('Start!!', {});
  } catch (error) {
    logger.error('Error handling create order request:', error);
  }
}


consumeFromExchange('orderExchange', 'order.create', 'orderQueue', handleCreateOrderRequest);



logger.info("Consumers for orderCreateRequestQueue and orderCreateResponseQueue have started.");
