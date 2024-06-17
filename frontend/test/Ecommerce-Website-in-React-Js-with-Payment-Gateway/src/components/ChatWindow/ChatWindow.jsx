import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import './ChatWindow.css';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: 'Xin chào 👋\nTôi có thể giúp gì cho bạn?', sender: 'bot' },
    { text: 'Tôi đang thất tình', sender: 'user' },
    {
      text: 'Tôi rất tiếc khi biết bạn đang trải qua khoảng thời gian khó khăn. Chia tay chưa bao giờ là dễ dàng. Tuy nhiên, thay vì ủ rũ, hãy tự thưởng cho bản thân một khởi đầu mới đầy năng lượng. Một đôi giày mới từ ThuThaoShoes có thể là liều thuốc tinh thần bạn cần lúc này!',
      sender: 'bot',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Chat với Admin</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="chat-body">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
          >
            <span>{message.text}</span>
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
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleSendMessage}>
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
