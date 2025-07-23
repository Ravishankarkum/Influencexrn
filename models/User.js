import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    trim: true,
    required: function() {
      return this.role === 'influencer'; // required only for influencer
    }
  },
  username: { 
    type: String, 
    unique: true, 
    trim: true,
    required: function() {
      return this.role === 'influencer'; // required only for influencer
    }
  },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['brand', 'influencer', 'admin'],
    required: true,
    default: 'influencer'
  },
  resetToken: String,
  resetExpire: Date
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
