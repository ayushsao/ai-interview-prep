// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const cors = require('cors');
// // // require('dotenv').config();

// // // const authRoutes = require('./routes/auth');
// // // const interviewRoutes = require('./routes/interviews');
// // // const questionRoutes = require('./routes/questions');
// // // const progressRoutes = require('./routes/progress');

// // // const app = express();

// // // // Middleware
// // // app.use(cors({
// // //   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
// // //   credentials: true
// // // }));
// // // app.use(express.json());

// // // // MongoDB Connection
// // // mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep')
// // //   .then(() => console.log('✅ Connected to MongoDB'))
// // //   .catch(err => console.error('❌ MongoDB connection error:', err));

// // // // Routes
// // // app.use('/api/auth', authRoutes);
// // // app.use('/api/interviews', interviewRoutes);
// // // app.use('/api/questions', questionRoutes);
// // // app.use('/api/progress', progressRoutes);

// // // // Health check
// // // app.get('/api/health', (req, res) => {
// // //   res.json({ status: 'ok', message: 'Interview Prep API is running!' });
// // // });

// // // // Error handling middleware
// // // app.use((err, req, res, next) => {
// // //   console.error(err.stack);
// // //   res.status(500).json({ error: 'Something went wrong!' });
// // // });

// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => {
// // //   console.log(`🚀 Server running on port ${PORT}`);
// // // });

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // require('dotenv').config();

// // const authRoutes = require('./routes/auth');
// // const interviewRoutes = require('./routes/interviews');
// // const questionRoutes = require('./routes/questions');
// // const progressRoutes = require('./routes/progress');

// // const app = express();

// // /**
// //  * =====================
// //  * MIDDLEWARE
// //  * =====================
// //  */

// // // ✅ CORS – FINAL FIX (Vercel + Render)
// // // app.use(cors({
// // //   origin: [
// // //     'https://ai-interview-prep-eight-phi.vercel.app',
// // //     'http://localhost:5173'
// // //   ],
// // //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// // //   credentials: true
// // // }));
// // app.use(cors({
// //   origin: [
// //     'https://ai-interview-prep-one-rosy.vercel.app/',
// //     'http://localhost:5173'
// //   ],
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   credentials: true
// // }));

// // app.options('*', cors());


// // // app.options('*', cors());
// // app.use(express.json());

// // /**
// //  * =====================
// //  * MONGODB CONNECTION
// //  * =====================
// //  */

// // if (!process.env.MONGODB_URI) {
// //   console.error('❌ MONGODB_URI is not set');
// //   process.exit(1);
// // }

// // mongoose
// //   .connect(process.env.MONGODB_URI)
// //   .then(() => console.log('✅ MongoDB connected'))
// //   .catch((err) => {
// //     console.error('❌ MongoDB connection error:', err);
// //     process.exit(1);
// //   });

// // /**
// //  * =====================
// //  * ROUTES
// //  * =====================
// //  */

// // app.use('/api/auth', authRoutes);
// // app.use('/api/interviews', interviewRoutes);
// // app.use('/api/questions', questionRoutes);
// // app.use('/api/progress', progressRoutes);

// // // ✅ Health check
// // app.get('/api/health', (req, res) => {
// //   res.json({
// //     status: 'ok',
// //     message: 'Interview Prep API is running'
// //   });
// // });

// // /**
// //  * =====================
// //  * ERROR HANDLER
// //  * =====================
// //  */
// // app.use((err, req, res, next) => {
// //   console.error('❌ Server Error:', err);
// //   res.status(500).json({ error: 'Internal Server Error' });
// // });

// // /**
// //  * =====================
// //  * START SERVER
// //  * =====================
// //  */
// // const PORT = process.env.PORT || 10000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const interviewRoutes = require('./routes/interviews');
// const questionRoutes = require('./routes/questions');
// const progressRoutes = require('./routes/progress');

// const app = express();

// // ✅ OPEN CORS (FINAL FIX)
// app.use(cors());
// app.use(express.json());

// // MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => {
//     console.error('❌ MongoDB error:', err);
//     process.exit(1);
//   });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/questions', questionRoutes);
// app.use('/api/progress', progressRoutes);

// // Health
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

// const PORT = process.env.PORT || 10000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const interviewRoutes = require("./routes/interviews");
const questionRoutes = require("./routes/questions");
const progressRoutes = require("./routes/progress");

const app = express();

/* ===== MIDDLEWARE ===== */
// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      // Add your Vercel frontend URLs here
      /\.vercel\.app$/,
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all for now, tighten in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());

/* ===== MONGODB ===== */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    console.warn("⚠️ Continuing without DB connection. Some routes may fail until MongoDB is available.");
  });

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ===== START ===== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
