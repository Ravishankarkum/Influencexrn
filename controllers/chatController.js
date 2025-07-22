// controllers/chatController.js
import Chat from '../models/Chat.js';
import Conversation from '../models/Conversation.js';

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver and text are required' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const message = await Chat.create({
      conversationId: conversation._id,
      senderId,
      text
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Chat.find({ conversationId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getConversationsByUser = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    }).populate('participants', 'name email');

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Chat.findById(id);
    if (!message)
      return res.status(404).json({ message: 'Message not found' });

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
