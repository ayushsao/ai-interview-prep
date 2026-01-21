const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  aiFeedback: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    strengths: [{
      type: String
    }],
    improvements: [{
      type: String
    }],
    detailedFeedback: {
      type: String
    },
    suggestedAnswer: {
      type: String
    }
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hr', 'technical', 'mixed', 'custom'],
    default: 'mixed'
  },
  techStack: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  answers: [answerSchema],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  completedQuestions: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  totalTime: {
    type: Number, // in seconds
    default: 0
  }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
