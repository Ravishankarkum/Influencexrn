import mongoose from 'mongoose';

// Schema for storing conversations between users
const conversationSchema = new mongoose.Schema({

  // List of users involved in the conversation (usually 2 participants)
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],

  // Stores the reference of the most recent chat message
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }

}, { 
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

// Creating model for the Conversation collection
const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
