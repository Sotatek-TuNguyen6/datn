const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");
const routerUser = require("./src/routes/AccountRouter");
const db = require("./src/config/connectDb");
const http = require('http');
const socketIo = require('socket.io');
const Account = require("./src/models/AcountModels")
const app = express();
dotenv.config();
db();
const port = process.env.PORT || 3000;
const Joi = require("joi");

// Create HTTP server
const server = http.createServer(app);
const io = socketIo(server);


// app.io = io
var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

app.use(express.static(__dirname + '/public'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.io = io
async function getAllAccounts(req, res) {
    try {
        const accounts = await Account.find();
        return accounts
    } catch (error) {
        res.status(500).json({ message: "Error retrieving accounts", error: error.message });
    }
};
// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Lắng nghe sự kiện chat message từ client
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);

        // Phát lại sự kiện chat message cho tất cả các client
        io.emit('chat message', msg);
    });

    // Xử lý sự kiện ngắt kết nối từ client
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// API routes
app.use("/api/v1/account", routerUser);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
