import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StartInterview from './pages/StartInterview';
import InterviewSession from './pages/InterviewSession';
import InterviewResults from './pages/InterviewResults';
import Progress from './pages/Progress';
import History from './pages/History';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/interview/start" element={<PrivateRoute><Layout><StartInterview /></Layout></PrivateRoute>} />
        <Route path="/interview/:sessionId" element={<PrivateRoute><Layout><InterviewSession /></Layout></PrivateRoute>} />
        <Route path="/interview/:sessionId/results" element={<PrivateRoute><Layout><InterviewResults /></Layout></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Layout><Progress /></Layout></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
