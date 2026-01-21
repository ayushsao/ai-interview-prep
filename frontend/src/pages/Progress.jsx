import { useEffect, useState } from 'react';
import { progressAPI } from '../services/api';
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Trophy, 
  Brain,
  Calendar,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function Progress() {
  const [analytics, setAnalytics] = useState(null);
  const [achievements, setAchievements] = useState({ earned: [], locked: [] });
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, achievementsRes, weeklyRes] = await Promise.all([
        progressAPI.getAnalytics(),
        progressAPI.getAchievements(),
        progressAPI.getWeekly()
      ]);
      
      setAnalytics(analyticsRes.data);
      setAchievements(achievementsRes.data);
      setWeeklyData(weeklyRes.data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const progress = analytics?.progress;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-gray-600 mt-1">Track your improvement over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress?.totalSessions || 0}</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress?.averageScore || 0}%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress?.streak?.current || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{progress?.totalQuestionsAnswered || 0}</p>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Score Trend
          </h2>
          {analytics?.scoreTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="#9ca3af"
                />
                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Complete interviews to see your score trend
            </div>
          )}
        </div>

        {/* Category Performance */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-600" />
            Performance by Category
          </h2>
          {analytics?.categoryBreakdown?.some(c => c.count > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.categoryBreakdown.filter(c => c.count > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                <Tooltip formatter={(value) => [`${value}%`, 'Average']} />
                <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Practice different categories to see your performance
            </div>
          )}
        </div>
      </div>

      {/* Weekly Activity */}
      {weeklyData && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            This Week's Activity
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.weeklyData?.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-600 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  day.sessions > 0 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {day.sessions}
                </div>
                <p className="text-xs text-gray-500 mt-1">{day.questions}q</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{weeklyData.summary?.totalSessions || 0}</p>
              <p className="text-sm text-gray-600">Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{weeklyData.summary?.totalQuestions || 0}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{weeklyData.summary?.averageScore || 0}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary-600" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.earned?.map((achievement, index) => (
            <div key={index} className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-center">
              <span className="text-3xl">{achievement.icon}</span>
              <p className="font-semibold text-gray-900 mt-2">{achievement.name}</p>
              <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
            </div>
          ))}
          {achievements.locked?.map((achievement, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center opacity-50">
              <span className="text-3xl grayscale">{achievement.icon}</span>
              <p className="font-semibold text-gray-500 mt-2">{achievement.name}</p>
              <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Progress;
