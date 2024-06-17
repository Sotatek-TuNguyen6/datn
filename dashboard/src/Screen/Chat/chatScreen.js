import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/Header';
import { io } from 'socket.io-client';
import './ChatScreen.css';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import axios from "axios";

const socket = io('http://localhost:8080');

const ChatScreen = () => {
    const user = useSelector((state) => state.user);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const userId = '667069eebe996098397b8fc5'; // Đặt ID của người dùng tại đây
    const adminId = user.id; // Đặt ID của admin tại đây
    const [users, setUsers] = useState();
    const [click, setClick] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Fetch users who have chatted with admin
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/chat-users`, {
                    params: { adminId }
                });
                setUsers(response.data.userInfos);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);
    const handleClickUser = async (userId) => {
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get("http://localhost:8080/messages", {
                    params: {
                        userId: userId,
                        adminId: user.id, // ID của admin
                    },
                });
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();
        setClick(true)
    }
    useEffect(() => {
        if (click) {
            // Tham gia vào phòng chat của admin
            socket.emit('join', { userId: adminId });

            // Lắng nghe sự kiện 'chat message' từ server
            socket.on('chat message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off('chat message');
            };
        }
    }, [click]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const newMessage = { sender: adminId, receiver: userId, message };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('chat message', newMessage);
            setMessage('');
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    return (
        <div className="chat-container">
            <Sidebar />
            <main className="main-wrap">
                <Header />
                <div className='d-flex' style={{ maxHeight: '100vh', overflow: 'auto' }}>
                    <div className="chat-sidebar">
                        <h4>Users</h4>
                        <ul>
                            {users?.map((user) => (
                                <li key={user._id} onClick={() => handleClickUser(user._id)}>
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="chat-window">
                        <div className="chat-messages">
                            {messages?.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.sender === adminId ? 'admin-message' : 'user-message'}`}>
                                    <div className="message-content">
                                        <span>{msg.message}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {click && <div className="chat-input">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatScreen;
