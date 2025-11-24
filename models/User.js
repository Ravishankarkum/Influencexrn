import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Email validation function using regex
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation function using regex
// Must contain uppercase, lowercase, number, and be at least 8 chars
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

const userSchema = mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },

    // Username only required for influencers who are NOT Google users
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

    // Brand name required only if role is "brand" and not logged in via Google
    brand_name: {
      type: String,
      trim: true,
      required: function () {
        return this.role === 'brand' && !this.googleId;
      },
      minlength: [2, 'Brand name must be at least 2 characters long'],
    },

    // User’s email, must belong to Gmail or GLA domain
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

    // Password required only for non-Google users
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      validate: {
        validator: function (password) {
          if (!password || this.googleId) return true; // Skip validation for Google users
          return validatePassword(password);
        },
        message:
          'Password must be at least 8 characters with uppercase, lowercase, and number',
      },
    },

    // Google authentication ID (if logged in via Google)
    googleId: {
      type: String,
      required: false,
    },

    // User role (influencer, brand, or admin)
    role: {
      type: String,
      enum: ['brand', 'influencer', 'admin'],
      default: 'influencer',
      required: true,
    },

    // Phone number required for non-Google users
    phone: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },

    // City required for non-Google users
    city: {
      type: String,
      trim: true,
      required: function () {
        return !this.googleId;
      },
      minlength: [2, 'City must be at least 2 characters long'],
    },

    // Industry field required only for brands
    industry: {
      type: String,
      trim: true,
      required: function () {
        return this.role === 'brand' && !this.googleId;
      },
    },

    // Optional website URL validation
    website: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        'Please enter a valid URL',
      ],
    },

    // Password reset token and expiry for forget password feature
    resetToken: String,
    resetExpire: Date,
  },
  {
    timestamps: true,             // Adds createdAt & updatedAt automatically
    toJSON: { virtuals: true },   // Include virtual fields in JSON output
    toObject: { virtuals: true }, // Include virtuals in object output
  }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware: hash password before saving (except Google users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleId) return next();

  if (!validatePassword(this.password)) {
    return next(
      new Error(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      )
    );
  }

  const salt = await bcrypt.genSalt(10);   // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

// Hide sensitive fields when sending response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetExpire;
  return obj;
};

// Index on role for faster queries
userSchema.index({ role: 1 });

// Creating and exporting User model
const User = mongoose.model('User', userSchema);
export default User;
