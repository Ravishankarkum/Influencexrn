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
