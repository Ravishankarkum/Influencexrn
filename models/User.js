import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: function () {
        return true;
      },
      minlength: [2, 'Name must be at least 2 characters long'],
    },

    username: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      required: function () {
        return this.role === 'influencer' && !this.googleId;
      },
      minlength: [3, 'Username must be at least 3 characters long'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },

    brand_name: {
      type: String,
      trim: true,
      required: function () {
        return this.role === 'brand' && !this.googleId;
      },
      minlength: [2, 'Brand name must be at least 2 characters long'],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          if (!validateEmail(email)) return false;
          return email.endsWith('@gmail.com') || email.endsWith('@gla.ac.in');
        },
        message: 'Email must be valid and from gmail.com or gla.ac.in domain',
      },
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;  // ⬅ Google users skip password requirement
      },
      validate: {
        validator: function (password) {
          if (!password || this.googleId) return true; // Skip check for Google users
          return validatePassword(password);
        },
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      },
    },

    googleId: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      enum: ['brand', 'influencer', 'admin'],
      required: true,
      default: 'influencer',
    },

    phone: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId; // ⬅ Skip for Google users
      },
    },

    city: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId; // ⬅ Skip for Google users
      },
      minlength: [2, 'City must be at least 2 characters long'],
    },

    industry: {
      type: String,
      trim: true,
      required: function () {
        return this.role === 'brand' && !this.googleId;
      },
    },

    website: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        'Please enter a valid URL',
      ],
    },

    resetToken: String,
    resetExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleId) return next(); // ⬅ Skip hashing for Google users

  if (!validatePassword(this.password)) {
    return next(
      new Error('Password must be at least 8 characters with uppercase, lowercase, and number')
    );
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetExpire;
  return obj;
};

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
