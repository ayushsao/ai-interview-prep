import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { Clock, Target, ChevronRight, Calendar, Filter } from 'lucide-react';

function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      
      const response = await interviewAPI.getHistory(params);
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Session History</h1>
          <p className="text-gray-600 mt-1">Review your past interview sessions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input py-2 w-auto"
          >
            <option value="all">All Sessions</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Link
              key={session._id}
              to={`/interview/${session._id}/results`}
              className="card hover:border-primary-300 transition-colors block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(session.overallScore)}`}>
                    <span className="font-bold">{session.overallScore}%</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {session.type} Interview
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {session.status}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {session.completedQuestions}/{session.totalQuestions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.round((session.totalTime || 0) / 60)}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No interview sessions found</p>
          <Link to="/interview/start" className="text-primary-600 font-medium hover:underline">
            Start your first interview →
          </Link>
        </div>
      )}
    </div>
  );
}

export default History;
