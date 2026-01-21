const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const { generateQuestions } = require('../services/aiService');

const router = express.Router();

// Get questions by category
router.get('/', auth, async (req, res) => {
  try {
    const { category, difficulty, techStack, limit = 10 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (techStack) filter.techStack = { $in: techStack.split(',') };

    const questions = await Question.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get random questions for interview
router.get('/random', auth, async (req, res) => {
  try {
    const { category, difficulty, count = 5, techStack } = req.query;
    
    const matchStage = {};
    if (category && category !== 'mixed') matchStage.category = category;
    if (difficulty) matchStage.difficulty = difficulty;
    if (techStack) matchStage.techStack = { $in: techStack.split(',') };

    const questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random questions' });
  }
});

// Generate AI questions
router.post('/generate', auth, async (req, res) => {
  try {
    const { category, techStack, difficulty, count } = req.body;
    
    const questions = await generateQuestions(category, techStack, difficulty, count);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Get single question
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Add new question (admin feature)
router.post('/', auth, async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

module.exports = router;
