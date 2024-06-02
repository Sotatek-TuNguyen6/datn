const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./src/model/messageModel');
const db = require("./src/config/connectDb");
const dotenv = require("dotenv");
dotenv.config();

db();

const app = express();
app.use(express.json())
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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
            message
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
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
