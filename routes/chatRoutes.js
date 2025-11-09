import express from 'express';
import {
    deleteMessage,
    getConversationsByUser,
    getMessages,
    sendMessage,
    sendHelpMessage
} from '../controllers/chatController.js';
import protect from '../middleware/authMiddleware.js';




const router = express.Router();

// Help route must come before /:conversationId to avoid route conflicts
router.post('/help', protect, sendHelpMessage);
router.get('/conversations/user', protect, getConversationsByUser);
router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.delete('/:id', protect, deleteMessage);

export default router;