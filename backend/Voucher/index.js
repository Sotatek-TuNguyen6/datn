const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");
const routerVoucher = require("./src/routes/voucherRouter");
const db = require("./src/config/connectDb");
const { consumeFromExchange } = require("./src/utils/amqp");
const app = express();
const Voucher = require("./src/model/voucherModels")
dotenv.config();
db();
const port = process.env.PORT || 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());
app.use(cors());

app.use("/api/v1/voucher", routerVoucher);
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: "An unexpected error occurred", error: err.message });
});
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);

    // await consumeFromExchange("orderExchange", "voucherQueue", "order.create", async (message) => {
    //     const { userId, voucher } = message;
    //     try {
    //         const order = await Voucher.findOne({ code: voucher });
           
    //     } catch (error) {
    //         logger.error(`Error}`, { error: error.message });
    //     }
    // })
});
