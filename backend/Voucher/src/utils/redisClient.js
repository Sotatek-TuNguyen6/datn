const redis = require('redis');

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
console.log(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`)

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected Successfully'));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis Client Connection Established');
  } catch (err) {
    console.error('Error Connecting to Redis', err);
  }
})();

module.exports = redisClient;
