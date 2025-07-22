import express from 'express';
import {
    deleteMessage,
    getConversationsByUser,
    getMessages,
    sendMessage
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.get('/conversations/user', protect, getConversationsByUser);

router.delete('/:id', protect, deleteMessage);

export default router;