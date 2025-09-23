const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: false
  },
  otpExpires: {
    type: Date,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt fields
  collection: 'users' // Specify the collection name
});

const User = mongoose.model('User', userSchema);

module.exports = User;
