const amqp = require('amqplib');
const logger = require('./logger');

let connection;
let channel;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Error connecting to RabbitMQ', { error: error.message });
    throw error;
  }
}

async function publishToQueue(queueName, message) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    logger.info(`Message sent to queue: ${queueName}`, { message });
  } catch (error) {
    logger.error(`Error publishing to queue: ${queueName}`, { error: error.message });
  }
}

async function consumeQueue(queueName, callback) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        logger.info(`Message received from queue: ${queueName}`, { messageContent });
        callback(messageContent);
        channel.ack(msg);
      }
    }, { noAck: false });

    logger.info(`Started consuming queue: ${queueName}`);
  } catch (error) {
    logger.error(`Error consuming queue: ${queueName}`, { error: error.message });
    throw error;
  }
}

process.on('exit', async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  logger.info('Closed RabbitMQ connection and channel');
});

module.exports = { publishToQueue, consumeQueue };
