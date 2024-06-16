const amqp = require('amqplib');

async function publishToQueue(queueName, message) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue: ${queueName}`, message);
    await channel.close();
    await connection.close();
}

async function consumeQueue(queueName, callback) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg) => {
        if (msg !== null) {
            const messageContent = JSON.parse(msg.content.toString());
            console.log(`Message received from queue: ${queueName}`, messageContent);
            callback(messageContent);
            channel.ack(msg);
        }
    });
}

module.exports = { publishToQueue, consumeQueue };
