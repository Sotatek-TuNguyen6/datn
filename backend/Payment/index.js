const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");
const routerPayment = require("./src/routes/paymentRouter");
const db = require("./src/config/connectDb");
const { consumeFromExchange, publishToExchange } = require("./src/utils/amqp");
const { handleCreatePaymentRequest, handleUpdateStatusPayment, handleUpdateStatusRefundPayment } = require("./src/services/paymentServices");
const logger = require("./src/utils/logger");
const app = express();


dotenv.config();
db();
const port = process.env.PORT || 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());
app.use(cors());

app.use("/api/v1/payment", routerPayment);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "An unexpected error occurred", error: err.message });
});
app.listen(port, async () => {
    console.log(`Server payment runing on port ${port}`);
    // consumeFromExchange("orderExchange", 'order.create', 'orderQueue', handleCreatePaymentRequest)
    // consumeFromExchange("orderExchange", 'order.update', 'orderQueueUpdate', handleUpdateStatusPayment)
    await consumeFromExchange('orderExchange', 'paymentQueue', 'inventory.reserved', async (message) => {
        const { amount, orderId, products, userId, emailUser, type } = message;
        try {
            const paymentSuccessful = await handleCreatePaymentRequest({ userId, orderId, products, amount });

            if (paymentSuccessful) {
                await publishToExchange('orderExchange', 'payment.completed', { userId, orderId, products, amount, emailUser, type });
            } else {
                await publishToExchange('orderExchange', 'payment.failed', { orderId });
            }
        } catch (error) {
            logger.error(`Error processing inventory.reserved event for order ${orderId}`, { error: error.message });
        }
    });

    await consumeFromExchange("orderUpdate", "paymentUpdateQueue", "order_update", async (message) => {
        const { orderId } = message
        try {
            const paymentSuccessful = await handleUpdateStatusRefundPayment({ userId, orderId, products, amount });
            if (paymentSuccessful) {
                logger.info(`Success sevent for order ${orderId}`);
            } else {
                logger.error(`Error event for order ${orderId}`);
            }
        } catch (error) {
            logger.error(`Error event for order ${error}`);

        }
    })

});
