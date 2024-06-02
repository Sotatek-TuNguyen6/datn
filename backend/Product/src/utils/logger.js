const winston = require("winston");

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/error.log', level: 'error' })
  ]
});

module.exports = logger;
