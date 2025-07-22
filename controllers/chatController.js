import Chat from '../models/Chat.js';
import Conversation from '../models/Conversation.js';

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver and text are required' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // Create a new conversation if not found
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    // Create a new message
    const message = await Chat.create({
      conversationId: conversation._id,
      senderId,
      text
    });

    // Update last message in conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
