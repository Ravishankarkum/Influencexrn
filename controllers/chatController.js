import Chat from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  const message = new Chat({ conversationId, senderId, text });
  await message.save();
  res.status(201).json(message);
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Chat.find({ conversationId });
  res.status(200).json(messages);
};

export const getConversationsByUser = async (req, res) => {
  const userId = req.user._id;
  const conversations = await Chat.find({ senderId: userId }).distinct('conversationId');
  res.status(200).json(conversations);
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const message = await Chat.findById(id);
  if (!message) return res.status(404).json({ message: 'Message not found' });
  if (message.senderId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this message' });
  }
  await message.deleteOne();
  res.status(200).json({ message: 'Message deleted' });
};