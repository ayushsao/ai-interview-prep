const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['hr', 'technical', 'behavioral', 'situational', 'coding'],
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  expectedTopics: [{
    type: String
  }],
  sampleAnswer: {
    type: String,
    default: ''
  },
  tips: [{
    type: String
  }],
  techStack: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
