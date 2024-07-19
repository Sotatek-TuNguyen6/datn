import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import "./ChatWindow.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:8080"); // Thay đổi URL phù hợp với cấu hình của bạn
const ChatWindow = ({ onClose }) => {
  const user = useSelector((state) => state.user);
  console.log("🚀 ~ ChatWindow ~ user:", user)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get("http://localhost:8080/messages", {
          params: {
            userId: user.id,
            adminId: "666331cfd4db5a08e6948e6d",
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
    socket.emit("join", { userId: user.id });

    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [user]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = {
        sender: user.id,
        receiver: "666331cfd4db5a08e6948e6d", // ID của admin
        message: newMessage,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("chat message", message);
      setNewMessage("");
    }
  };

  const handleLoginRedirect = () => {
    history("/login");
  };
  
  if (!user || !user.access_token) {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <span>Chat with Admin</span>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="chat-body">
          <div className="no-user-message">
            You need to log in to chat with Admin.
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginRedirect}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Chat with Admin</span>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="chat-body">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === user.id ? "user-message" : "admin-message"
            }`}
          >
            <img
              src={
                message.sender === user.id
                  ? user.avatar
                  : "/path/to/admin/avatar.jpg"
              } // Cập nhật đường dẫn ảnh đại diện phù hợp
              alt="avatar"
              className="avatar"
            />
            <div className="message-content">
              <span>{message.message}</span>
              <div className="message-time">just now</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Enter question..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
