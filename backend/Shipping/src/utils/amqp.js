const amqp = require('amqplib');
const logger = require('./logger');

let connection;
let channel;

async function connectRabbitMQ() {
  if (!connection || connection.connection.stream.destroyed) {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error', { error: err.message });
      connection = null;
    });
    connection.on('close', () => {
      logger.info('RabbitMQ connection closed');
      connection = null;
    });
  }
  if (!channel || channel.connection.stream.destroyed) {
    channel = await connection.createChannel();
    channel.on('error', (err) => {
      logger.error('RabbitMQ channel error', { error: err.message });
      channel = null;
    });
    channel.on('close', () => {
      logger.info('RabbitMQ channel closed');
      channel = null;
    });
  }
}

async function publishToExchangeV2(exchangeName, routingKey, message, REPLY_QUEUE) {
  try {
    await connectRabbitMQ();
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    const correlationId = generateUuid();

    return new Promise((resolve, reject) => {
      const replyQueue = REPLY_QUEUE;
      channel.consume(replyQueue, (msg) => {
        if (msg.properties.correlationId === correlationId) {
          resolve(JSON.parse(msg.content.toString()));
        }
      }, { noAck: true });

      channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)), {
        correlationId: correlationId,
        replyTo: replyQueue
      });

      logger.info(`Message sent to exchange: ${exchangeName} with routingKey: ${routingKey}`, { message });
    });
  } catch (error) {
    logger.error(`Error publishing to exchange: ${exchangeName}`, { error: error.message });
    throw error;
  }
}
async function publishToExchange(exchangeName, routingKey, message) {
  try {
    await connectRabbitMQ();
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
    logger.info(`Message sent to exchange: ${exchangeName} with routingKey: ${routingKey}`, { message });

  } catch (error) {
    logger.error(`Error publishing to exchange: ${exchangeName}`, { error: error.message });
  }
}
async function consumeFromExchange(exchangeName, queueName, bindingKey, callback) {
  try {
    await connectRabbitMQ();
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, bindingKey);

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        logger.info(`Message received from exchange: ${exchangeName} with routingKey: ${bindingKey}`, { messageContent });
        callback(messageContent);
        channel.ack(msg);
      }
    }, { noAck: false });

    logger.info(`Started consuming from exchange: ${exchangeName} with bindingKey: ${bindingKey}`);
  } catch (error) {
    logger.error(`Error consuming from exchange: ${exchangeName}`, { error: error.message });
    throw error;
  }
}
async function consumeFromExchangeV2(exchangeName, queueName, bindingKey) {
  return new Promise(async (resolve, reject) => {
    try {
      await connectRabbitMQ();
      await channel.assertExchange(exchangeName, 'topic', { durable: true });
      await channel.assertQueue(queueName, { durable: true });
      await channel.bindQueue(queueName, exchangeName, bindingKey);

      channel.consume(queueName, (msg) => {
        if (msg !== null) {
          const messageContent = JSON.parse(msg.content.toString());
          logger.info(`Message received from exchange: ${exchangeName} with routingKey: ${bindingKey}`, { messageContent });
          channel.ack(msg);
          resolve(messageContent);
        }
      }, { noAck: false });

      logger.info(`Started consuming from exchange: ${exchangeName} with bindingKey: ${bindingKey}`);
    } catch (error) {
      logger.error(`Error consuming from exchange: ${exchangeName}`, { error: error.message });
      reject(error);
    }
  });
}
async function publishToQueue(queueName, message) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false  });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    logger.info(`Message sent to queue: ${queueName}`, { message });
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`Error publishing to queue: ${queueName}`, { error: error.message });
  }
}

async function publishToQueueV2(queueName, message, callback) {
  try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const { queue } = await channel.assertQueue('', { exclusive: true });

      const correlationId = generateUuid();

      channel.consume(queue, (msg) => {
          if (msg.properties.correlationId === correlationId) {
              const messageContent = JSON.parse(msg.content.toString());
              logger.info(`Message received from temporary queue: ${queue}`, { messageContent });
              callback(messageContent);
              channel.ack(msg);
              setTimeout(() => {
                  channel.close();
                  connection.close();
              }, 500);
          }
      }, { noAck: false });

      await channel.assertQueue(queueName, { durable: true });
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
          correlationId,
          replyTo: queue
      });
      logger.info(`Message sent to queue: ${queueName}`, { message });

  } catch (error) {
      logger.error(`Error publishing to queue: ${queueName}`, { error: error.message });
  }
}
async function consumeQueue(queueName, callback) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
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

async function consumeQueuev2(queueName, timeout = 10000) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false  });

    return new Promise((resolve, reject) => {
      channel.consume(queueName, (msg) => {
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

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

async function sendMessageAndWaitForResponse(exchangeName, routingKey, message, responseQueueName) {
  const correlationId = generateUuid();
  await connectRabbitMQ();

  return new Promise((resolve, reject) => {
    channel.assertQueue(responseQueueName, { durable: true });

    channel.consume(responseQueueName, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        resolve(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      }
    }, { noAck: false });

    channel.sendToQueue(exchangeName, Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: responseQueueName
    });
  });
}
module.exports = {
  publishToQueue, consumeQueue, publishToExchangeV2, publishToQueueV2,
  consumeFromExchangeV2, consumeFromExchange, publishToExchange, consumeQueuev2, sendMessageAndWaitForResponse
};
