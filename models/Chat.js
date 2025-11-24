import mongoose from 'mongoose';

// Creating chat schema to store individual chat messages
const chatSchema = new mongoose.Schema({

  // Unique ID of the conversation this message belongs to
  conversationId: { type: String, required: true },

  // ID of the user who sent the message (linked to User model)
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Actual text message content
  text: { type: String, required: true }

}, { 
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

// Exporting Chat model based on the schema
export default mongoose.model('Chat', chatSchema);
