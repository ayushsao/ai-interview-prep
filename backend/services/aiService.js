const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate AI feedback for interview answer
 */
const generateFeedback = async (question, category, userAnswer, expectedTopics = []) => {
  try {
    const systemPrompt = `You are an expert interview coach with years of experience in HR and technical interviews. 
Your task is to evaluate interview answers and provide constructive, actionable feedback.
Be encouraging but honest. Focus on helping the candidate improve.
Always provide specific examples and suggestions.`;

    const userPrompt = `
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

Return ONLY valid JSON, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    const feedback = JSON.parse(content);
    return feedback;
  } catch (error) {
    console.error('AI Feedback Error:', error);
    
    // Return fallback feedback if AI fails
    return {
      overallScore: 50,
      strengths: ['Attempted to answer the question'],
      improvements: ['Could not generate detailed feedback at this time'],
      detailedFeedback: 'Our AI service is temporarily unavailable. Please try again later.',
      suggestedAnswer: 'Suggested answer unavailable.'
    };
  }
};

/**
 * Generate interview questions based on criteria
 */
const generateQuestions = async (category, techStack = [], difficulty = 'medium', count = 5) => {
  try {
    const systemPrompt = `You are an expert interviewer who creates insightful interview questions.
Create realistic questions that would be asked in actual job interviews.`;

    const userPrompt = `
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

Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(content);
    return result.questions;
  } catch (error) {
    console.error('AI Question Generation Error:', error);
    return [];
  }
};

/**
 * Analyze progress and provide insights
 */
const analyzeProgress = async (progressData) => {
  try {
    const systemPrompt = `You are a career coach analyzing interview practice progress.
Provide actionable insights and personalized recommendations.`;

    const userPrompt = `
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

Return ONLY valid JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
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
