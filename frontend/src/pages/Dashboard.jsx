import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { progressAPI, interviewAPI } from '../services/api';
import { 
  PlayCircle, 
  TrendingUp, 
  Target, 
  Flame, 
  Trophy,
  Clock,
  ArrowRight,
  Brain
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [progressRes, historyRes, insightsRes] = await Promise.all([
        progressAPI.getProgress(),
        interviewAPI.getHistory({ limit: 5 }),
        progressAPI.getInsights()
      ]);
      
      setStats(progressRes.data);
      setRecentSessions(historyRes.data);
      setInsights(insightsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-white/80 mb-6">
          {stats?.totalSessions > 0 
            ? "Ready to continue your interview preparation journey?"
            : "Start your first mock interview and get AI-powered feedback!"}
        </p>
        <Link 
          to="/interview/start" 
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          <PlayCircle className="h-5 w-5" />
          Start New Interview
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalSessions || 0}</p>
              <p className="text-sm text-gray-600">Sessions</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageScore || 0}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.streak?.current || 0}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalQuestionsAnswered || 0}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary-600" />
            AI Insights
          </h2>
          {insights ? (
            <div className="space-y-4">
              <p className="text-gray-700">{insights.overallAssessment}</p>
              
              {insights.topStrengths?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Your Strengths:</p>
                  <ul className="space-y-1">
                    {insights.topStrengths.map((strength, i) => (
                      <li key={i} className="text-sm text-green-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {insights.focusAreas?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Focus Areas:</p>
                  <ul className="space-y-1">
                    {insights.focusAreas.map((area, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-primary-50 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-primary-900">Weekly Goal</p>
                <p className="text-primary-700">{insights.weeklyGoal}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Complete your first interview to get personalized insights!</p>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Recent Sessions
            </h2>
            <Link to="/history" className="text-sm text-primary-600 hover:underline">
              View All
            </Link>
          </div>
          
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <Link
                  key={session._id}
                  to={`/interview/${session._id}/results`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {session.type} Interview
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.completedQuestions}/{session.totalQuestions} questions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      session.overallScore >= 75 ? 'text-green-600' :
                      session.overallScore >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {session.overallScore}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No sessions yet</p>
              <Link to="/interview/start" className="text-primary-600 font-medium hover:underline">
                Start your first interview →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/interview/start" className="card hover:border-primary-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <PlayCircle className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Practice Interview</p>
              <p className="text-sm text-gray-600">Start a mock session</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </Link>

        <Link to="/progress" className="card hover:border-primary-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">View Progress</p>
              <p className="text-sm text-gray-600">Track your improvement</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </Link>

        <Link to="/history" className="card hover:border-primary-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Session History</p>
              <p className="text-sm text-gray-600">Review past sessions</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
