const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");
const routerOrder = require("./src/routes/orderRouter");
const db = require("./src/config/connectDb");
const Order = require("./src/model/orderModel");
const { consumeFromExchange, consumeQueue, consumeQueueV2, publishToExchange } = require("./src/utils/amqp");
const logger = require("./src/utils/logger");
const { getAllOrder } = require("./src/service/orderService");
const app = express();

dotenv.config();
db();
const port = process.env.PORT || 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

// require('./src/service/orderService');

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());
app.use(cors());

app.use("/api/v1/order", routerOrder);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "An unexpected error occurred", error: err.message });
});
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  await consumeFromExchange('orderExchange', 'inventoryReservationFailedQueue', 'inventory.reservation_failed', async (message) => {
    const { orderId } = message;
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'inventory_reservation_failed';
        await order.save();
        logger.info(`Order ${orderId} status updated to inventory_reservation_failed`);
      } else {
        logger.error(`Order ${orderId} not found`);
      }
    } catch (error) {
      logger.error(`Error processing inventory.reservation_failed for order ${orderId}`, { error: error.message });
    }
  });

  await consumeFromExchange('orderExchange', 'inventoryReservedQueue', 'inventory.reserved', async (message) => {
    const { orderId } = message;
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'inventory_reserved';
        await order.save();
        logger.info(`Order ${orderId} status updated to inventory_reserved`);
      } else {
        logger.error(`Order ${orderId} not found`);
      }
    } catch (error) {
      logger.error(`Error processing inventory.reserved for order ${orderId}`, { error: error.message });
    }
  });

  await consumeFromExchange('orderExchange', 'paymentCompletedQueue', 'payment.completed', async (message) => {
    const { orderId } = message;
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'payment_completed';
        await order.save();
        logger.info(`Order ${orderId} status updated to payment_completed`);
      } else {
        logger.error(`Order ${orderId} not found`);
      }
    } catch (error) {
      logger.error(`Error processing payment.completed for order ${orderId}`, { error: error.message });
    }
  });

  await consumeFromExchange('orderExchange', 'paymentFailedQueue', 'payment.failed', async (message) => {
    const { orderId } = message;
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'payment_failed';
        await order.save();
        logger.info(`Order ${orderId} status updated to payment_failed`);
      } else {
        logger.error(`Order ${orderId} not found`);
      }
    } catch (error) {
      logger.error(`Error processing payment.failed for order ${orderId}`, { error: error.message });
    }
  });

  await consumeFromExchange('productResponse', 'test', 'product_respone', async (message) => {
    console.log(message)
  });

  await consumeFromExchange('deleteShipping', 'deleteShippingQueue', 'delete_shipping', async (message) => {
    const { orderId } = message
    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.status = 'cancelled';
        await order.save();
        await publishToExchange("orderUpdate", "order_update", { orderId })
        logger.info(`Order ${orderId} status updated to payment_failed`);
      } else {
        logger.error(`Order ${orderId} not found`);
      }
    } catch (error) {
      logger.error(`Error processing payment.failed for order ${orderId}`, { error: error.message });
    }
  })

  await consumeQueueV2('order-request', getAllOrder);

});
