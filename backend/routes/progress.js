const express = require('express');
const Progress = require('../models/Progress');
const InterviewSession = require('../models/InterviewSession');
const auth = require('../middleware/auth');
const { analyzeProgress } = require('../services/aiService');

const router = express.Router();

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.userId });
    
    if (!progress) {
      progress = new Progress({ user: req.userId });
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get detailed analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.userId });
    
    // Get recent sessions for trend analysis
    const recentSessions = await InterviewSession.find({
      user: req.userId,
      status: 'completed'
    })
      .sort({ completedAt: -1 })
      .limit(10);

    // Calculate trends
    const scoreTrend = recentSessions.map(s => ({
      date: s.completedAt,
      score: s.overallScore,
      type: s.type
    }));

    // Category breakdown
    const categoryBreakdown = Object.entries(progress?.categoryScores || {}).map(([category, data]) => ({
      category,
      average: data.average || 0,
      count: data.count || 0
    }));

    res.json({
      progress,
      scoreTrend,
      categoryBreakdown,
      recentSessions: recentSessions.map(s => ({
        id: s._id,
        type: s.type,
        score: s.overallScore,
        date: s.completedAt,
        questionsAnswered: s.completedQuestions
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get AI-powered insights
router.get('/insights', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.userId });
    
    if (!progress || progress.totalQuestionsAnswered === 0) {
      return res.json({
        overallAssessment: 'Start practicing to get personalized insights!',
        topStrengths: [],
        focusAreas: ['Begin with HR questions to warm up'],
        weeklyGoal: 'Complete your first practice session',
        motivationalMessage: 'Every expert was once a beginner. Start your journey today!'
      });
    }

    const insights = await analyzeProgress(progress);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Get achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.userId });
    
    // Define possible achievements
    const allAchievements = [
      { id: 'first_session', name: 'First Steps', description: 'Complete your first interview session', icon: '🎯', requirement: p => p.totalSessions >= 1 },
      { id: 'five_sessions', name: 'Getting Serious', description: 'Complete 5 interview sessions', icon: '📚', requirement: p => p.totalSessions >= 5 },
      { id: 'ten_sessions', name: 'Dedicated Learner', description: 'Complete 10 interview sessions', icon: '🌟', requirement: p => p.totalSessions >= 10 },
      { id: 'streak_3', name: 'Consistent', description: 'Maintain a 3-day practice streak', icon: '🔥', requirement: p => p.streak?.longest >= 3 },
      { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day practice streak', icon: '💪', requirement: p => p.streak?.longest >= 7 },
      { id: 'score_80', name: 'High Performer', description: 'Achieve an average score of 80%+', icon: '🏆', requirement: p => p.averageScore >= 80 },
      { id: 'questions_50', name: 'Question Master', description: 'Answer 50 questions', icon: '📝', requirement: p => p.totalQuestionsAnswered >= 50 }
    ];

    const earned = [];
    const locked = [];

    for (const achievement of allAchievements) {
      if (progress && achievement.requirement(progress)) {
        const existing = progress.achievements?.find(a => a.name === achievement.name);
        earned.push({
          ...achievement,
          earnedAt: existing?.earnedAt || new Date()
        });
        
        // Add to progress if not already there
        if (!existing) {
          progress.achievements.push({
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            earnedAt: new Date()
          });
        }
      } else {
        locked.push(achievement);
      }
    }

    if (progress) {
      await progress.save();
    }

    res.json({ earned, locked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get weekly progress
router.get('/weekly', auth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const sessions = await InterviewSession.find({
      user: req.userId,
      status: 'completed',
      completedAt: { $gte: oneWeekAgo }
    });

    const dailyStats = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStats[dateStr] = { sessions: 0, questions: 0, avgScore: 0, totalScore: 0 };
    }

    sessions.forEach(session => {
      const dateStr = session.completedAt.toISOString().split('T')[0];
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].sessions += 1;
        dailyStats[dateStr].questions += session.completedQuestions;
        dailyStats[dateStr].totalScore += session.overallScore;
        dailyStats[dateStr].avgScore = Math.round(
          dailyStats[dateStr].totalScore / dailyStats[dateStr].sessions
        );
      }
    });

    res.json({
      weeklyData: Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        ...stats
      })).reverse(),
      summary: {
        totalSessions: sessions.length,
        totalQuestions: sessions.reduce((sum, s) => sum + s.completedQuestions, 0),
        averageScore: sessions.length > 0
          ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly progress' });
  }
});

module.exports = router;
