# AI-Powered Smart Interview Prep Platform

A full-stack MERN application that helps users practice mock interviews with AI-powered feedback and track their improvement over time.

## 🚀 Features

- **Mock Interviews**: Practice HR, technical, and behavioral interview questions
- **AI Feedback**: Get instant, detailed feedback on your answers using OpenAI
- **Progress Tracking**: Monitor your improvement with charts and analytics
- **Achievement System**: Earn badges for consistent practice
- **Personalized Experience**: Tailored questions based on your experience level and tech stack

## 📁 Project Structure

```
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic (AI service)
│   ├── middleware/         # Auth middleware
│   ├── seeds/              # Database seeders
│   └── server.js           # Entry point
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── services/       # API client
│   │   └── App.jsx         # Root component
│   └── index.html
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - API server
- **MongoDB** + **Mongoose** - Database
- **OpenAI API** - AI feedback generation
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Recharts** - Analytics charts
- **Lucide React** - Icons

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/interview-prep
   JWT_SECRET=your-secret-key
   OPENAI_API_KEY=your-openai-api-key
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

5. Seed the database with sample questions:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Interviews
- `POST /api/interviews/start` - Start new interview session
- `POST /api/interviews/:id/answer` - Submit answer and get AI feedback
- `POST /api/interviews/:id/complete` - Complete interview session
- `GET /api/interviews/history` - Get user's interview history
- `GET /api/interviews/:id` - Get session details

### Questions
- `GET /api/questions` - Get questions by category
- `GET /api/questions/random` - Get random questions
- `POST /api/questions/generate` - Generate AI questions

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/analytics` - Get detailed analytics
- `GET /api/progress/insights` - Get AI-powered insights
- `GET /api/progress/achievements` - Get achievements
- `GET /api/progress/weekly` - Get weekly activity

## 🎨 Key Pages

1. **Landing Page** - Introduction and sign-up CTA
2. **Dashboard** - Overview of stats, insights, and quick actions
3. **Start Interview** - Configure interview type, difficulty, and tech stack
4. **Interview Session** - Answer questions and receive real-time AI feedback
5. **Results** - View detailed breakdown of interview performance
6. **Progress** - Charts, achievements, and improvement tracking
7. **History** - Browse past interview sessions
8. **Profile** - Update personal information and preferences

## 🔒 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## 🤖 AI Integration

The platform uses OpenAI's GPT-4o-mini model to:
- Evaluate interview answers and provide scores (0-100)
- Identify strengths and areas for improvement
- Generate detailed feedback and model answers
- Create personalized interview questions
- Analyze progress and provide insights

## 📈 Future Enhancements

- [ ] Voice-based interviews with speech-to-text
- [ ] Video recording and analysis
- [ ] Company-specific question banks
- [ ] Peer practice sessions
- [ ] Interview scheduling with reminders
- [ ] Resume analysis and tailored questions
- [ ] Mobile app version

## 📝 License

MIT License - feel free to use this project for learning or building your own interview prep platform!

---

Built with ❤️ for job seekers everywhere
