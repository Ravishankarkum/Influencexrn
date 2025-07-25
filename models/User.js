import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    trim: true,
    required: function() {
      return this.role === 'influencer';
    }
  },
  username: { 
    type: String, 
    unique: true, 
    trim: true,
    sparse: true, // prevents errors if undefined for brands
    required: function() {
      return this.role === 'influencer';
    }
  },
  brand_name: { 
    type: String,
    trim: true,
    required: function() {
      return this.role === 'brand';
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
  phone: { type: String, trim: true },
  city: { type: String, trim: true },
  industry: { type: String, trim: true },
  website: { type: String, trim: true },
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

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetToken;
  delete userObject.resetExpire;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
