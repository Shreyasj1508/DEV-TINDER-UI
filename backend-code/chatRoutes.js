// Backend Chat Routes (routes/chat.js)

const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {
  getChatMessages,
  sendMessage,
  getUserChats,
  markMessagesAsRead
} = require('../controllers/chatController');

const router = express.Router();

// Get all chats for logged-in user
router.get('/', userAuth, getUserChats);

// Get chat messages with a specific user
router.get('/:targetUserId', userAuth, getChatMessages);

// Send a message
router.post('/send', userAuth, sendMessage);

// Mark messages as read
router.patch('/:targetUserId/read', userAuth, markMessagesAsRead);

module.exports = router;
