const express = require('express');
const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');
const { generateFeedback, generateQuestions } = require('../services/aiService');

const router = express.Router();

// Start new interview session
router.post('/start', auth, async (req, res) => {
  try {
    const { type, techStack, difficulty, questionCount = 5 } = req.body;

    let questions = [];
    
    // If tech stack is selected, generate questions using AI
    if (techStack?.length > 0) {
      console.log('Generating AI questions for tech stack:', techStack);
      
      // Determine category based on type
      let category = 'technical';
      if (type === 'hr') {
        category = 'behavioral';
      } else if (type === 'mixed') {
        category = 'mixed technical and behavioral';
      }
      
      // Generate questions using Gemini AI
      const aiQuestions = await generateQuestions(category, techStack, difficulty, parseInt(questionCount));
      
      if (aiQuestions && aiQuestions.length > 0) {
        questions = aiQuestions.map((q, index) => ({
          _id: `ai-${Date.now()}-${index}`,
          question: q.question,
          category: q.category || category,
          difficulty: q.difficulty || difficulty,
          tips: q.tips || [],
          expectedTopics: q.expectedTopics || [],
          isAIGenerated: true
        }));
        console.log(`Generated ${questions.length} AI questions`);
      }
    }
    
    // If no AI questions or no tech stack, fetch from database
    if (questions.length === 0) {
      const query = {};
      
      // Map interview type to question categories
      if (type && type !== 'mixed') {
        if (type === 'hr') {
          query.category = { $in: ['hr', 'behavioral', 'situational'] };
        } else if (type === 'technical') {
          query.category = { $in: ['technical', 'coding'] };
        } else {
          query.category = type;
        }
      }
      
      if (difficulty) query.difficulty = difficulty;

      console.log('Query for questions:', JSON.stringify(query));

      // Get random questions from database
      questions = await Question.aggregate([
        { $match: query },
        { $sample: { size: parseInt(questionCount) } }
      ]);

      console.log(`Found ${questions.length} questions from database`);
    }

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for the selected criteria' });
    }

    // Create session
    const session = new InterviewSession({
      user: req.userId,
      type,
      techStack,
      difficulty,
      totalQuestions: questions.length,
      status: 'in-progress'
    });

    await session.save();

    res.status(201).json({
      session: {
        id: session._id,
        type: session.type,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions
      },
      questions: questions.map(q => ({
        id: q._id,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        tips: q.tips,
        expectedTopics: q.expectedTopics
      }))
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

// Submit answer and get AI feedback
router.post('/:sessionId/answer', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, questionText, userAnswer, timeSpent, category, expectedTopics } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ error: 'Session already completed' });
    }

    // Check if this is an AI-generated question (ID starts with 'ai-')
    const isAIGeneratedQuestion = typeof questionId === 'string' && questionId.startsWith('ai-');
    
    let question = null;
    let questionExpectedTopics = expectedTopics || [];
    
    // Only try to find in database if it's not an AI-generated question
    if (!isAIGeneratedQuestion) {
      try {
        question = await Question.findById(questionId);
        if (question) {
          questionExpectedTopics = question.expectedTopics || [];
        }
      } catch (err) {
        // Ignore invalid ObjectId errors for AI-generated questions
        console.log('Question not found in database, using provided data');
      }
    }
    
    // Generate AI feedback
    const aiFeedback = await generateFeedback(
      questionText,
      category || question?.category || 'general',
      userAnswer,
      questionExpectedTopics
    );

    // Add answer to session (store questionId as string for AI-generated questions)
    const answer = {
      question: isAIGeneratedQuestion ? null : questionId,
      questionText,
      userAnswer,
      aiFeedback,
      timeSpent: timeSpent || 0
    };

    session.answers.push(answer);
    session.completedQuestions = session.answers.length;
    session.totalTime += timeSpent || 0;

    // Calculate running average score
    const totalScore = session.answers.reduce((sum, a) => sum + (a.aiFeedback?.overallScore || 0), 0);
    session.overallScore = Math.round(totalScore / session.answers.length);

    await session.save();

    // Update progress
    await updateProgress(req.userId, category || question?.category || 'technical', aiFeedback.overallScore);

    res.json({
      feedback: aiFeedback,
      progress: {
        completed: session.completedQuestions,
        total: session.totalQuestions,
        currentScore: session.overallScore
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Complete interview session
router.post('/:sessionId/complete', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();

    // Update user progress
    const progress = await Progress.findOne({ user: req.userId });
    if (progress) {
      progress.totalSessions += 1;
      
      // Update streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (progress.streak.lastPracticeDate) {
        const lastDate = new Date(progress.streak.lastPracticeDate);
        lastDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          progress.streak.current += 1;
        } else if (diffDays > 1) {
          progress.streak.current = 1;
        }
      } else {
        progress.streak.current = 1;
      }
      
      if (progress.streak.current > progress.streak.longest) {
        progress.streak.longest = progress.streak.current;
      }
      
      progress.streak.lastPracticeDate = today;
      progress.updatedAt = new Date();
      
      await progress.save();
    }

    res.json({
      message: 'Interview completed',
      summary: {
        totalQuestions: session.totalQuestions,
        completedQuestions: session.completedQuestions,
        overallScore: session.overallScore,
        totalTime: session.totalTime,
        answers: session.answers.map(a => ({
          question: a.questionText,
          score: a.aiFeedback?.overallScore || 0,
          strengths: a.aiFeedback?.strengths || [],
          improvements: a.aiFeedback?.improvements || []
        }))
      }
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Get user's interview history
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 10, status } = req.query;
    
    const query = { user: req.userId };
    if (status) query.status = status;

    const sessions = await InterviewSession.find(query)
      .sort({ startedAt: -1 })
      .limit(parseInt(limit))
      .select('-answers.userAnswer -answers.aiFeedback.suggestedAnswer');

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get specific session details
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.sessionId,
      user: req.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Helper function to update progress
async function updateProgress(userId, category, score) {
  try {
    const progress = await Progress.findOne({ user: userId });
    if (!progress) return;

    progress.totalQuestionsAnswered += 1;
    
    // Update category score
    if (category && progress.categoryScores[category]) {
      progress.categoryScores[category].total += score;
      progress.categoryScores[category].count += 1;
      progress.categoryScores[category].average = Math.round(
        progress.categoryScores[category].total / progress.categoryScores[category].count
      );
    }

    // Update overall average
    const allScores = Object.values(progress.categoryScores);
    const totalAvg = allScores.reduce((sum, cat) => sum + (cat.average || 0), 0);
    const categoriesWithScores = allScores.filter(cat => cat.count > 0).length;
    progress.averageScore = categoriesWithScores > 0 ? Math.round(totalAvg / categoriesWithScores) : 0;

    progress.updatedAt = new Date();
    await progress.save();
  } catch (error) {
    console.error('Update progress error:', error);
  }
}

module.exports = router;
