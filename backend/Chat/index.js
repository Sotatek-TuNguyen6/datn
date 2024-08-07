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

/**
 * Controller for creating a new account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/chat-users', async (req, res) => {
    const { adminId } = req.query;

    try {
        const messages = await Message.find({ $or: [{ sender: adminId }, { receiver: adminId }] });
        const userIds = [...new Set(messages.map(msg => msg.sender === adminId ? msg.receiver : msg.sender))];
        const message = {
            userIds: userIds,
        };

        await publishToQueue('user-info-request', message);

        // Wait for all userInfoPromises to resolve
        try {
            const userInfos = await consumeQueue('user-info-response');

            res.json(userInfos.accounts);
        } catch (error) {
            console.error(`Error consuming user info response:`, error);
            throw error;
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Controller for creating a new account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/messages', async (req, res) => {
    const { userId, adminId } = req.query;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: adminId },
                { sender: adminId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Controller for creating a new account
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
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

// Mock chat list data
// const chatList = [
//     { chatId: '1', participantIds: ['user1', 'user2'], creatorId: 'user1' },
//     { chatId: '2', participantIds: ['user3', 'user4'], creatorId: 'user3' },
// ];

// io.on('connection', (socket) => {
//     console.log('New client connected');

//     socket.on('message:send', (message) => {
//         console.log('Received message:', message);
//         io.emit('message', message); // Broadcast the message to all connected clients
//     });

//     socket.on('reaction', (reaction) => {
//         console.log('Received reaction:', reaction);
//         io.emit('reaction', reaction); // Broadcast the reaction to all connected clients
//     });

//     socket.on('chat:create', (data) => {
//         console.log('Received chat:create event:', data);

//         // Simulate chat creation and emit a success event
//         const chatCreatedEvent = {
//             chatId: Date.now().toString(), // Simulate a unique chat ID
//             participantIds: data.participantIds,
//             creatorId: data.creatorId,
//         };

//         chatList.push(chatCreatedEvent); // Add the new chat to the chat list

//         io.emit('chat:created-success', chatCreatedEvent); // Emit the chat created success event
//     });

//     socket.on('chat:list', () => {
//         console.log('Received chat:list event');
//         socket.emit('chat:list', chatList); // Send the chat list to the requesting client
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// server.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`);
// });
