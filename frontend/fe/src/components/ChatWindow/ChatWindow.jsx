import React, { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import "./ChatWindow.css";
import { useSelector } from "react-redux";
import axios from "axios";

const socket = io("http://localhost:8080"); // Thay đổi URL phù hợp với cấu hình của bạn

const ChatWindow = ({ onClose }) => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get("http://localhost:8080/messages", {
          params: {
            userId: user.id,
            adminId: "666331cfd4db5a08e6948e6d", // ID của admin
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
    // Join the chat room for the user
    socket.emit("join", { userId: user.id });

    // Lắng nghe sự kiện 'chat message' từ server
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

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Chat với Admin</span>
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
          placeholder="Nhập câu hỏi..."
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
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
