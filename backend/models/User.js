const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior', 'lead'],
    default: 'fresher'
  },
  skills: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
