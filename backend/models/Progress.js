const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalQuestionsAnswered: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  categoryScores: {
    hr: { total: { type: Number, default: 0 }, count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
    technical: { total: { type: Number, default: 0 }, count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
    behavioral: { total: { type: Number, default: 0 }, count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
    situational: { total: { type: Number, default: 0 }, count: { type: Number, default: 0 }, average: { type: Number, default: 0 } },
    coding: { total: { type: Number, default: 0 }, count: { type: Number, default: 0 }, average: { type: Number, default: 0 } }
  },
  weeklyProgress: [{
    week: Date,
    sessionsCompleted: Number,
    averageScore: Number,
    questionsAnswered: Number
  }],
  strengths: [{
    type: String
  }],
  areasToImprove: [{
    type: String
  }],
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastPracticeDate: Date
  },
  achievements: [{
    name: String,
    description: String,
    earnedAt: Date,
    icon: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
