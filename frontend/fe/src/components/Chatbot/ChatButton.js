import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWindow from '../ChatWindow/ChatWindow';
import { Avatar } from '@mui/material';
import './ChatButton.css';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatButtonClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleChatButtonClick}
        className="shake"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          minWidth: '60px',
          minHeight: '60px',
          background: 'linear-gradient(135deg, #4C67FF, #4CAEFF)',
          padding: 0,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Avatar
          src={'https://f88.vn/images/root/actions/mess.svg'}
          alt="Chat Logo"
          style={{
            width: '40px',
            height: '40px',
            margin: '10px',
          }}
        />
      </Button>
      {isChatOpen && <ChatWindow onClose={handleCloseChat} />}
    </>
  );
};

export default ChatButton;
