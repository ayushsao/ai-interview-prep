const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try multiple model names for compatibility
let model;
try {
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} catch (e) {
  try {
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (e2) {
    console.error('Failed to initialize Gemini model:', e2);
  }
}

/**
 * Fallback question templates for when AI is unavailable
 */
const generateFallbackQuestions = (category, techStack, difficulty, count) => {
  const techName = techStack.length > 0 ? techStack[0] : 'general technology';
  const allTechs = techStack.join(', ') || 'various technologies';
  
  const technicalQuestions = [
    {
      question: `Explain the core concepts of ${techName} and how it differs from similar technologies.`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Core concepts', 'Key features', 'Comparison with alternatives'],
      tips: ['Start with a brief overview', 'Mention specific features', 'Give practical examples']
    },
    {
      question: `How would you optimize performance in a ${techName} application?`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Performance bottlenecks', 'Optimization techniques', 'Best practices'],
      tips: ['Identify common issues first', 'Explain your approach', 'Mention tools you would use']
    },
    {
      question: `Describe a challenging problem you solved using ${techName}.`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Problem description', 'Solution approach', 'Outcome'],
      tips: ['Use STAR method', 'Be specific about your role', 'Quantify results if possible']
    },
    {
      question: `What are the best practices for error handling in ${techName}?`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Error types', 'Handling strategies', 'Logging and monitoring'],
      tips: ['Mention specific patterns', 'Discuss try-catch usage', 'Talk about user experience']
    },
    {
      question: `How do you ensure code quality and maintainability when working with ${allTechs}?`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Code standards', 'Testing', 'Documentation', 'Code reviews'],
      tips: ['Mention specific tools', 'Discuss team practices', 'Talk about CI/CD']
    },
    {
      question: `Explain the architecture you would use for a scalable application using ${allTechs}.`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Architecture patterns', 'Scalability considerations', 'Technology choices'],
      tips: ['Draw or describe the flow', 'Justify your choices', 'Consider trade-offs']
    },
    {
      question: `What are common security vulnerabilities in ${techName} applications and how do you prevent them?`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Security vulnerabilities', 'Prevention techniques', 'Security tools'],
      tips: ['Mention OWASP top 10', 'Give specific examples', 'Discuss security best practices']
    },
    {
      question: `How would you implement testing for a ${techName} project?`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Testing types', 'Testing tools', 'Test coverage'],
      tips: ['Mention unit, integration, e2e tests', 'Discuss test frameworks', 'Talk about TDD']
    },
    {
      question: `Describe how you would set up CI/CD for a project using ${allTechs}.`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['CI/CD pipeline', 'Deployment strategies', 'Automation tools'],
      tips: ['Mention specific tools', 'Describe the pipeline stages', 'Discuss rollback strategies']
    },
    {
      question: `What new features or improvements would you like to see in ${techName}?`,
      category: 'technical',
      difficulty: difficulty,
      expectedTopics: ['Current limitations', 'Proposed improvements', 'Industry trends'],
      tips: ['Show deep knowledge', 'Be constructive', 'Reference community discussions']
    }
  ];
  
  // Shuffle and return requested count
  const shuffled = technicalQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Fallback scoring when AI is unavailable
 * Evaluates answer based on length, structure, and keyword matching
 */
const calculateFallbackScore = (question, userAnswer, expectedTopics = []) => {
  const answer = userAnswer.trim().toLowerCase();
  const questionLower = question.toLowerCase();
  
  // Very short or gibberish answers get low scores
  if (answer.length < 10) {
    return {
      score: 5,
      strengths: [],
      improvements: ['Answer is too short - please provide a detailed response', 'Try to address the question directly', 'Include specific examples or explanations']
    };
  }
  
  if (answer.length < 30) {
    return {
      score: 15,
      strengths: ['Attempted to answer'],
      improvements: ['Answer needs more detail and depth', 'Explain your reasoning', 'Provide specific examples']
    };
  }
  
  let score = 20; // Base score for attempting
  const strengths = [];
  const improvements = [];
  
  // Check answer length (good answers are usually detailed)
  const wordCount = answer.split(/\s+/).length;
  if (wordCount >= 50) {
    score += 15;
    strengths.push('Provided a detailed response');
  } else if (wordCount >= 30) {
    score += 10;
    strengths.push('Reasonable answer length');
  } else {
    improvements.push('Consider providing more detail in your answer');
  }
  
  // Check if answer contains relevant keywords from question
  const questionWords = questionLower.split(/\s+/).filter(w => w.length > 4);
  const relevantWords = questionWords.filter(w => answer.includes(w));
  const relevanceRatio = relevantWords.length / Math.max(questionWords.length, 1);
  
  if (relevanceRatio >= 0.3) {
    score += 15;
    strengths.push('Answer addresses the question topic');
  } else {
    improvements.push('Make sure to directly address what the question is asking');
  }
  
  // Check for expected topics coverage
  if (expectedTopics.length > 0) {
    const topicsCovered = expectedTopics.filter(topic => 
      answer.includes(topic.toLowerCase())
    ).length;
    const topicRatio = topicsCovered / expectedTopics.length;
    
    if (topicRatio >= 0.5) {
      score += 20;
      strengths.push('Covered key expected topics');
    } else if (topicRatio >= 0.25) {
      score += 10;
      improvements.push('Try to cover more of the expected topics');
    } else {
      improvements.push('Review the key topics that should be addressed');
    }
  } else {
    // No expected topics - give partial credit for structured answer
    if (answer.includes('because') || answer.includes('example') || answer.includes('for instance')) {
      score += 10;
      strengths.push('Provided reasoning or examples');
    }
  }
  
  // Check for structure indicators
  const hasStructure = answer.includes('first') || answer.includes('second') || 
                       answer.includes('finally') || answer.includes('additionally') ||
                       answer.includes('1.') || answer.includes('2.') ||
                       answer.includes('•') || answer.includes('-');
  if (hasStructure) {
    score += 10;
    strengths.push('Well-structured response');
  } else {
    improvements.push('Consider organizing your answer with clear points');
  }
  
  // Check for professional language
  const hasProfessionalTerms = answer.includes('implement') || answer.includes('approach') ||
                                answer.includes('solution') || answer.includes('strategy') ||
                                answer.includes('experience') || answer.includes('project');
  if (hasProfessionalTerms) {
    score += 10;
    strengths.push('Used professional terminology');
  }
  
  // Cap the score
  score = Math.min(score, 85); // Max 85 without AI (can't verify quality)
  
  // Ensure we have at least one item in each array
  if (strengths.length === 0) {
    strengths.push('Attempted to answer the question');
  }
  if (improvements.length === 0) {
    improvements.push('Consider adding more specific examples');
  }
  
  return { score, strengths, improvements };
};

/**
 * Generate AI feedback for interview answer
 */
const generateFeedback = async (question, category, userAnswer, expectedTopics = []) => {
  try {
    const prompt = `You are an expert interview coach with years of experience in HR and technical interviews. 
Your task is to evaluate interview answers and provide constructive, actionable feedback.
Be encouraging but honest. Focus on helping the candidate improve.
Always provide specific examples and suggestions.

Question Category: ${category}
Interview Question: ${question}
${expectedTopics.length > 0 ? `Expected Topics to Cover: ${expectedTopics.join(', ')}` : ''}

Candidate's Answer: ${userAnswer}

Please evaluate this answer and provide feedback in the following JSON format:
{
  "overallScore": <number 0-100>,
  "strengths": [<list of 2-3 specific strengths>],
  "improvements": [<list of 2-3 specific areas to improve>],
  "detailedFeedback": "<2-3 paragraph detailed feedback>",
  "suggestedAnswer": "<a model answer for reference>"
}

Scoring guidelines:
- 90-100: Exceptional answer, covers all key points with great examples
- 75-89: Strong answer with minor areas for improvement
- 60-74: Good attempt but missing some key elements
- 45-59: Needs significant improvement
- 0-44: Requires major rework

Return ONLY valid JSON, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    const feedback = JSON.parse(content);
    return feedback;
  } catch (error) {
    console.error('AI Feedback Error:', error);
    
    // Use intelligent fallback scoring when AI fails
    const fallback = calculateFallbackScore(question, userAnswer, expectedTopics);
    
    return {
      overallScore: fallback.score,
      strengths: fallback.strengths,
      improvements: fallback.improvements,
      detailedFeedback: `Your answer has been evaluated using our basic scoring system (AI service is temporarily unavailable). Based on our analysis: Your response ${fallback.score >= 50 ? 'shows understanding of the topic' : 'needs more development'}. ${fallback.score < 40 ? 'Try to provide more detailed, structured answers that directly address the question.' : 'Continue to practice providing detailed, well-organized responses with specific examples.'}`,
      suggestedAnswer: 'AI-generated model answer is currently unavailable. Please review the expected topics and structure your answer to cover all key points.'
    };
  }
};

/**
 * Generate interview questions based on criteria
 */
const generateQuestions = async (category, techStack = [], difficulty = 'medium', count = 5) => {
  // If no model available or no API key, use fallback
  if (!model || !process.env.GEMINI_API_KEY) {
    console.log('Using fallback question generator (no AI model available)');
    return generateFallbackQuestions(category, techStack, difficulty, count);
  }

  try {
    const prompt = `You are an expert interviewer who creates insightful interview questions.
Create realistic questions that would be asked in actual job interviews.

Generate ${count} ${difficulty} difficulty ${category} interview questions.
${techStack.length > 0 ? `Tech Stack: ${techStack.join(', ')}` : ''}

Return in this JSON format:
{
  "questions": [
    {
      "question": "<the question>",
      "category": "${category}",
      "difficulty": "${difficulty}",
      "expectedTopics": [<key points to cover>],
      "tips": [<2-3 tips for answering>]
    }
  ]
}

Return ONLY valid JSON, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    // Clean up response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(content);
    return parsed.questions;
  } catch (error) {
    console.error('AI Question Generation Error:', error.message || error);
    console.log('Falling back to template questions');
    return generateFallbackQuestions(category, techStack, difficulty, count);
  }
};

/**
 * Analyze progress and provide insights
 */
const analyzeProgress = async (progressData) => {
  try {
    const prompt = `You are a career coach analyzing interview practice progress.
Provide actionable insights and personalized recommendations.

Analyze this interview practice progress and provide insights:

Total Sessions: ${progressData.totalSessions}
Average Score: ${progressData.averageScore}%
Category Performance:
${Object.entries(progressData.categoryScores || {})
  .map(([cat, data]) => `- ${cat}: ${data.average || 0}% (${data.count || 0} questions)`)
  .join('\n')}

Current Streak: ${progressData.streak?.current || 0} days

Provide response in JSON format:
{
  "overallAssessment": "<1-2 sentence overall assessment>",
  "topStrengths": [<2-3 key strengths>],
  "focusAreas": [<2-3 areas to focus on>],
  "weeklyGoal": "<specific goal for next week>",
  "motivationalMessage": "<encouraging message>"
}

Return ONLY valid JSON, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    // Clean up response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Progress Analysis Error:', error);
    return {
      overallAssessment: 'Keep practicing to improve your interview skills!',
      topStrengths: ['Consistent practice'],
      focusAreas: ['Continue practicing all categories'],
      weeklyGoal: 'Complete 3 practice sessions this week',
      motivationalMessage: 'Every practice session brings you closer to your dream job!'
    };
  }
};

module.exports = {
  generateFeedback,
  generateQuestions,
  analyzeProgress
};
