import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation function
function validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    trim: true,
    required: function() {
      return true; // Name is required for all users
    },
    minlength: [2, 'Name must be at least 2 characters long']
  },
  username: { 
    type: String, 
    unique: true, 
    trim: true,
    sparse: true, // prevents errors if undefined for brands
    required: function() {
      return this.role === 'influencer';
    },
    minlength: [3, 'Username must be at least 3 characters long'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  brand_name: { 
    type: String,
    trim: true,
    required: function() {
      return this.role === 'brand';
    },
    minlength: [2, 'Brand name must be at least 2 characters long']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    validate: {
      validator: function(email) {
        // Use the provided validateEmail function
        if (!validateEmail(email)) {
          return false;
        }
        
        // Email must end with either @gmail.com or @gla.ac.in
        return email.endsWith('@gmail.com') || email.endsWith('@gla.ac.in');
      },
      message: 'Email must be valid and from gmail.com or gla.ac.in domain'
    }
  },
  password: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(password) {
        // Use the provided validatePassword function
        return validatePassword(password);
      },
      message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
    }
  },
  role: {
    type: String,
    enum: ['brand', 'influencer', 'admin'],
    required: true,
    default: 'influencer'
  },
  phone: { 
    type: String, 
    trim: true,
    required: true
  },
  city: { 
    type: String, 
    trim: true,
    required: true,
    minlength: [2, 'City must be at least 2 characters long']
  },
  industry: { 
    type: String, 
    trim: true,
    required: function() {
      return this.role === 'brand';
    }
  },
  website: { 
    type: String, 
    trim: true,
    match: [/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/, 'Please enter a valid URL']
  },
  resetToken: String,
  resetExpire: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Check password strength using the provided function
  if (!validatePassword(this.password)) {
    return next(new Error('Password must be at least 8 characters with uppercase, lowercase, and number'));
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetToken;
  delete userObject.resetExpire;
  return userObject;
};

// Add indexes for better query performance
// Note: email and username indexes are already created by unique: true
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;