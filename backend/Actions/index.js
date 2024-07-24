const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");
const routeAction = require("./src/routes/actionRouter");
const db = require("./src/config/connectDb");
const { consumeFromExchange, publishToQueue } = require("./src/utils/amqp");
const app = express();
const Action = require("./src/model/actionModel");
const logger = require("./src/utils/logger");
dotenv.config();
db();
const port = process.env.PORT || 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());
app.use(cors());
// require('./src/service/serviceActions');

app.use("/api/v1/actions", routeAction);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "An unexpected error occurred", error: err.message });
});
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);

    await consumeFromExchange("orderExchange", "actionsQueue", "order.update", async (message) => {
        const { userId, products } = message
        const productId = products[0].productId
        const actionType = "purchase"

        // TODO: i will change when parse 2
        try {
            const existingAction = await Action.findOne({ userId, productId, actionType });

            if (existingAction) {
                logger.info(`Action already exists`);
                return;
            }

            const newAction = await Action.create({ userId, productId, actionType });

            const allActions = await Action.find();

            logger.info(`Action cretesucess`);

            await publishToQueue('recommend_queue_actions', allActions);

            // res.status(201).json(newAction);
        } catch (error) {
            logger.error(error);

            // res.status(400).json({ error: error.message });
        }
    })
});
