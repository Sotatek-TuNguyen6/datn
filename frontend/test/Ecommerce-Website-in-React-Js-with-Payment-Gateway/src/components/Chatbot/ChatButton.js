import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWindow from '../ChatWindow/ChatWindow';

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
        variant="contained"
        color="primary"
        onClick={handleChatButtonClick}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
      >
        <ChatIcon />
      </Button>
      {isChatOpen && <ChatWindow onClose={handleCloseChat} />}
    </>
  );
};

export default ChatButton;
