// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const interviewRoutes = require('./routes/interviews');
// const questionRoutes = require('./routes/questions');
// const progressRoutes = require('./routes/progress');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep')
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/questions', questionRoutes);
// app.use('/api/progress', progressRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'Interview Prep API is running!' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interviews');
const questionRoutes = require('./routes/questions');
const progressRoutes = require('./routes/progress');

const app = express();

/**
 * =====================
 * MIDDLEWARE
 * =====================
 */

// ✅ CORS – FIXED for Vercel + Render
app.use(cors({
  origin: [
    'https://ai-interview-prep-one-rosy.vercel.app/',
    'http://localhost:5173' // local dev
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

/**
 * =====================
 * MONGODB CONNECTION
 * =====================
 */

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * =====================
 * ROUTES
 * =====================
 */

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

// Health check (IMPORTANT for debugging)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Interview Prep API is running'
  });
});

/**
 * =====================
 * ERROR HANDLER
 * =====================
 */
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

/**
 * =====================
 * START SERVER
 * =====================
 */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
