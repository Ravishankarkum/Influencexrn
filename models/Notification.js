import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['campaign_created', 'campaign_updated', 'collaboration_request', 'message'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  campaign: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign' 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;