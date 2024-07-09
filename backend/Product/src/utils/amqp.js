let connection;
let channel;

async function connectRabbitMQ() {
  if (!connection || connection.connection.stream.destroyed) {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
  }
  if (!channel || channel.connection.connection.stream.destroyed) {
    channel = await connection.createChannel();
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

// async function publishToExchange(exchangeName, routingKey, message) {
//   try {
//     const connection = await amqp.connect(process.env.RABBITMQ_URL);
//     const channel = await connection.createChannel();
//     await channel.assertExchange(exchangeName, 'topic', { durable: true });
//     channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
//     logger.info(`Message sent to exchange: ${exchangeName} with routingKey: ${routingKey}`, { message });
//     await channel.close();
//     await connection.close();
//   } catch (error) {
//     logger.error(`Error publishing to exchange: ${exchangeName}`, { error: error.message });
//   }
// }

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

module.exports = { publishToQueue, consumeQueue, consumeFromExchange, publishToExchange };
