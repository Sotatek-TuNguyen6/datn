const amqp = require('amqplib');
const logger = require('./logger');

async function publishToQueue(queueName, message) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    logger.info(`Message sent to queue: ${queueName}`, { message });
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`Error publishing to queue: ${queueName}`, { error: error.message });
  }
}

async function consumeQueue(queueName, timeout = 10000) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    return new Promise((resolve, reject) => {
      channel.consume(queueName, (msg) => {
        console.log("🚀 ~ channel.consume ~ msg:", JSON.parse(msg.content))
        if (msg !== null) {
          const messageContent = JSON.parse(msg.content.toString());
          logger.info(`Message received from queue: ${queueName}`, { messageContent });
          channel.ack(msg);
          resolve(messageContent);
          channel.close();
          connection.close();
        }
      }, { noAck: false });
    });
  } catch (error) {
    logger.error(`Error consuming queue: ${queueName}`, { error: error.message });
    throw error;
  }
}

module.exports = { publishToQueue, consumeQueue };
