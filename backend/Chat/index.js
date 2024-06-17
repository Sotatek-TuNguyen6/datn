const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./src/model/messageModel');
const db = require("./src/config/connectDb");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { publishToQueue, consumeQueue } = require('./src/utils/amqp');

dotenv.config();

db();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const port = process.env.PORT || 5003;

var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());

app.get('/chat-users', async (req, res) => {
    const { adminId } = req.query;

    try {
        const messages = await Message.find({ $or: [{ sender: adminId }, { receiver: adminId }] });
        const userIds = [...new Set(messages.map(msg => msg.sender === adminId ? msg.receiver : msg.sender))];
        const userInfoPromises = userIds.map(async (userId) => {
            const message = {
                userId: userId,
            };

            console.log("--- start send")
            await publishToQueue('user-info-request', message);

            console.log("---- end send")
            try {
                console.log('await....')
                const userInfo = await consumeQueue('user-info-response');
                console.log('ok....')

                return userInfo;
            } catch (error) {
                console.error(`Error consuming user info for userId ${userId}:`, error);
                throw error;
            }
        });

        // Wait for all userInfoPromises to resolve
        const userInfos = await Promise.all(userInfoPromises);
        res.json({ userInfos });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/messages', async (req, res) => {
    const { userId, adminId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: adminId },
                { sender: adminId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });
        console.log('vao day r');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/messages', async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const newMessage = new Message({
            sender,
            receiver,
            message,
            timestamp: new Date()
        });
        await newMessage.save();

        io.emit('chat message', newMessage);

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', async (msg) => {
        try {
            console.log(msg);

            const newMessage = new Message({
                sender: msg.sender,
                receiver: msg.receiver,
                message: msg.message,
                timestamp: new Date()
            });
            await newMessage.save();

            io.to(msg.receiver).emit('chat message', newMessage);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('join', ({ userId }) => {
        socket.join(userId);
        console.log(`${userId} joined the chat`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
