const mongoose = require('mongoose');
require('dotenv').config();

const Question = require('../models/Question');

const sampleQuestions = [
  // HR Questions
  {
    question: "Tell me about yourself.",
    category: "hr",
    difficulty: "easy",
    expectedTopics: ["professional background", "relevant experience", "career goals", "key achievements"],
    tips: ["Keep it professional and concise", "Focus on relevant experience", "End with why you're interested in this role"],
    sampleAnswer: "I'm a software developer with 3 years of experience in full-stack development..."
  },
  {
    question: "Why do you want to work for our company?",
    category: "hr",
    difficulty: "easy",
    expectedTopics: ["company research", "culture fit", "growth opportunities", "alignment with goals"],
    tips: ["Research the company beforehand", "Be specific about what attracts you", "Connect it to your career goals"]
  },
  {
    question: "What are your greatest strengths and weaknesses?",
    category: "hr",
    difficulty: "medium",
    expectedTopics: ["self-awareness", "specific examples", "improvement strategies", "honesty"],
    tips: ["Be honest but strategic", "Give real examples", "Show how you're working on weaknesses"]
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "hr",
    difficulty: "medium",
    expectedTopics: ["career goals", "growth mindset", "company alignment", "realistic expectations"],
    tips: ["Show ambition but be realistic", "Align with company growth", "Demonstrate commitment"]
  },
  {
    question: "Why are you leaving your current job?",
    category: "hr",
    difficulty: "medium",
    expectedTopics: ["professional reasons", "growth opportunities", "positive framing", "no negativity"],
    tips: ["Never badmouth previous employer", "Focus on growth opportunities", "Be positive about the transition"]
  },

  // Behavioral Questions
  {
    question: "Tell me about a time you faced a challenging situation at work and how you handled it.",
    category: "behavioral",
    difficulty: "medium",
    expectedTopics: ["STAR method", "problem-solving", "resilience", "outcome"],
    tips: ["Use STAR method (Situation, Task, Action, Result)", "Be specific", "Highlight your role"]
  },
  {
    question: "Describe a situation where you had to work with a difficult team member.",
    category: "behavioral",
    difficulty: "medium",
    expectedTopics: ["conflict resolution", "communication", "empathy", "collaboration"],
    tips: ["Focus on resolution not blame", "Show emotional intelligence", "Emphasize teamwork"]
  },
  {
    question: "Give an example of when you showed leadership.",
    category: "behavioral",
    difficulty: "medium",
    expectedTopics: ["initiative", "team influence", "decision making", "results"],
    tips: ["Leadership isn't just about titles", "Show initiative and influence", "Quantify results if possible"]
  },
  {
    question: "Tell me about a time you failed and what you learned from it.",
    category: "behavioral",
    difficulty: "hard",
    expectedTopics: ["accountability", "learning", "growth mindset", "application"],
    tips: ["Own the failure honestly", "Focus on lessons learned", "Show how you applied the learning"]
  },

  // Technical Questions - JavaScript
  {
    question: "Explain the difference between var, let, and const in JavaScript.",
    category: "technical",
    subcategory: "JavaScript",
    difficulty: "easy",
    techStack: ["JavaScript", "Node.js", "React"],
    expectedTopics: ["scope", "hoisting", "reassignment", "block scope"],
    tips: ["Explain scope differences", "Mention hoisting behavior", "Give practical examples"]
  },
  {
    question: "What is the event loop in JavaScript and how does it work?",
    category: "technical",
    subcategory: "JavaScript",
    difficulty: "medium",
    techStack: ["JavaScript", "Node.js"],
    expectedTopics: ["call stack", "callback queue", "microtasks", "async execution"],
    tips: ["Draw or describe the flow", "Mention call stack and queues", "Explain async behavior"]
  },
  {
    question: "Explain closures in JavaScript with an example.",
    category: "technical",
    subcategory: "JavaScript",
    difficulty: "medium",
    techStack: ["JavaScript", "Node.js", "React"],
    expectedTopics: ["lexical scope", "function scope", "data privacy", "practical uses"],
    tips: ["Give a clear definition", "Provide a practical example", "Explain use cases"]
  },
  {
    question: "What are Promises and how do async/await work?",
    category: "technical",
    subcategory: "JavaScript",
    difficulty: "medium",
    techStack: ["JavaScript", "Node.js", "React"],
    expectedTopics: ["Promise states", "chaining", "error handling", "async syntax"],
    tips: ["Explain Promise states", "Show the evolution from callbacks", "Demonstrate async/await syntax"]
  },

  // Technical Questions - React
  {
    question: "What are React hooks and why were they introduced?",
    category: "technical",
    subcategory: "React",
    difficulty: "easy",
    techStack: ["React", "JavaScript"],
    expectedTopics: ["useState", "useEffect", "functional components", "code reuse"],
    tips: ["Explain the problem they solve", "Mention common hooks", "Compare to class components"]
  },
  {
    question: "Explain the virtual DOM and how React uses it for performance.",
    category: "technical",
    subcategory: "React",
    difficulty: "medium",
    techStack: ["React", "JavaScript"],
    expectedTopics: ["reconciliation", "diffing algorithm", "batching", "performance"],
    tips: ["Explain what virtual DOM is", "Describe the diffing process", "Mention performance benefits"]
  },
  {
    question: "What is the difference between useEffect and useLayoutEffect?",
    category: "technical",
    subcategory: "React",
    difficulty: "hard",
    techStack: ["React", "JavaScript"],
    expectedTopics: ["timing", "blocking", "use cases", "DOM measurements"],
    tips: ["Explain execution timing", "Describe when to use each", "Give practical examples"]
  },

  // Technical Questions - Node.js
  {
    question: "How does Node.js handle concurrent requests if it's single-threaded?",
    category: "technical",
    subcategory: "Node.js",
    difficulty: "medium",
    techStack: ["Node.js", "JavaScript"],
    expectedTopics: ["event loop", "non-blocking I/O", "libuv", "worker threads"],
    tips: ["Explain the event-driven architecture", "Mention libuv and thread pool", "Describe non-blocking I/O"]
  },
  {
    question: "What is middleware in Express.js and how does it work?",
    category: "technical",
    subcategory: "Node.js",
    difficulty: "easy",
    techStack: ["Node.js", "Express"],
    expectedTopics: ["request-response cycle", "next function", "order", "types of middleware"],
    tips: ["Explain the middleware chain", "Describe the next() function", "Give examples of common middleware"]
  },

  // Technical Questions - Database
  {
    question: "Explain the difference between SQL and NoSQL databases.",
    category: "technical",
    subcategory: "Database",
    difficulty: "easy",
    techStack: ["MongoDB", "PostgreSQL", "MySQL"],
    expectedTopics: ["schema", "scalability", "ACID", "use cases"],
    tips: ["Compare structure and flexibility", "Discuss scalability patterns", "Mention appropriate use cases"]
  },
  {
    question: "What are indexes in databases and when should you use them?",
    category: "technical",
    subcategory: "Database",
    difficulty: "medium",
    techStack: ["MongoDB", "PostgreSQL", "MySQL"],
    expectedTopics: ["query performance", "trade-offs", "types of indexes", "optimization"],
    tips: ["Explain how indexes work", "Discuss read vs write trade-offs", "Mention when not to use them"]
  },

  // Situational Questions
  {
    question: "How would you handle a situation where you disagree with your manager's technical decision?",
    category: "situational",
    difficulty: "medium",
    expectedTopics: ["respect", "communication", "data-driven approach", "compromise"],
    tips: ["Show respect for authority", "Emphasize data-driven discussion", "Be open to different perspectives"]
  },
  {
    question: "What would you do if you realized you couldn't meet a project deadline?",
    category: "situational",
    difficulty: "medium",
    expectedTopics: ["communication", "prioritization", "solutions", "proactivity"],
    tips: ["Communicate early", "Come with solutions not just problems", "Show accountability"]
  },

  // Coding Questions
  {
    question: "How would you implement a function to check if a string is a palindrome?",
    category: "coding",
    difficulty: "easy",
    techStack: ["JavaScript", "Python"],
    expectedTopics: ["string manipulation", "two pointers", "edge cases", "time complexity"],
    tips: ["Consider edge cases", "Discuss time complexity", "Mention different approaches"]
  },
  {
    question: "Explain how you would design a rate limiter.",
    category: "coding",
    difficulty: "hard",
    techStack: ["System Design", "Node.js"],
    expectedTopics: ["token bucket", "sliding window", "distributed systems", "trade-offs"],
    tips: ["Discuss different algorithms", "Consider distributed scenarios", "Mention trade-offs"]
  }
];

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep');
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} questions`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedQuestions();
