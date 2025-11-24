import mongoose from 'mongoose';

// Schema for storing notifications sent between users
const notificationSchema = new mongoose.Schema({

  // The user who will receive the notification
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // The user who triggers/sends the notification
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Type of notification (fixed set of allowed values)
  type: { 
    type: String, 
    enum: ['campaign_created', 'campaign_updated', 'collaboration_request', 'message'], 
    required: true 
  },

  // Small title shown in notification
  title: { type: String, required: true },

  // Full message body of the notification
  message: { type: String, required: true },

  // Optional: Linked campaign, if the notification is about a campaign
  campaign: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign' 
  },

  // Whether the notification is read or unread
  read: { 
    type: Boolean, 
    default: false 
  },

  // Timestamp for when the notification was created
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { 
  // Adds createdAt and updatedAt timestamps automatically
  timestamps: true 
});

// Exporting the Notification model
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
