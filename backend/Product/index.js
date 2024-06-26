const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");
const routerProduct = require("./src/routes/productRouter");
const categoryRouter = require("./src/routes/categoryRouter");
const db = require("./src/config/connectDb");
const logger = require('./src/utils/logger'); // Ensure logger is configured

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

require('./src/service/productConsumer');

app.use("/api/v1/product", routerProduct);
app.use("/api/v1/category", categoryRouter);

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ success: false, message: "An unexpected error occurred", error: err.message });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
