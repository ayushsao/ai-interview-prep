import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Home,
  RotateCcw,
  TrendingUp
} from 'lucide-react';

function InterviewResults() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { currentSession, answers, getSession } = useInterviewStore();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    if (currentSession && answers.length > 0) {
      setSession({
        ...currentSession,
        answers: answers.map(a => ({
          questionText: a.question.question,
          score: a.feedback?.overallScore || 0,
          strengths: a.feedback?.strengths || [],
          improvements: a.feedback?.improvements || []
        }))
      });
      setLoading(false);
    } else {
      const result = await getSession(sessionId);
      if (result.success) {
        setSession(result.session);
      }
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

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Session not found</p>
        <Link to="/dashboard" className="text-primary-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const overallScore = session.overallScore || 
    (answers.length > 0 
      ? Math.round(answers.reduce((sum, a) => sum + (a.feedback?.overallScore || 0), 0) / answers.length)
      : 0);

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'Excellent!', color: 'text-green-600' };
    if (score >= 80) return { grade: 'A', label: 'Great job!', color: 'text-green-600' };
    if (score >= 70) return { grade: 'B', label: 'Good work!', color: 'text-blue-600' };
    if (score >= 60) return { grade: 'C', label: 'Keep practicing!', color: 'text-amber-600' };
    return { grade: 'D', label: 'Needs improvement', color: 'text-red-600' };
  };

  const { grade, label, color } = getScoreGrade(overallScore);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="card text-center py-12">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Completed!</h1>
        <p className="text-gray-600 mb-8">{label}</p>

        <div className="flex items-center justify-center gap-12">
          <div>
            <p className={`text-6xl font-bold ${color}`}>{overallScore}%</p>
            <p className="text-gray-600 mt-1">Overall Score</p>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{session.completedQuestions || answers.length} questions answered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Target className="h-5 w-5 text-primary-500" />
              <span className="capitalize">{session.type} interview</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>{Math.round((session.totalTime || 0) / 60)} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Breakdown */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Question Breakdown</h2>
        <div className="space-y-4">
          {(session.answers || answers).map((answer, index) => {
            const score = answer.score || answer.feedback?.overallScore || answer.aiFeedback?.overallScore || 0;
            const questionText = answer.questionText || answer.question?.question || `Question ${index + 1}`;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {index + 1}. {questionText}
                    </p>
                    {(answer.strengths || answer.aiFeedback?.strengths)?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-green-700">Strengths: </span>
                        <span className="text-xs text-gray-600">
                          {(answer.strengths || answer.aiFeedback?.strengths).join(', ')}
                        </span>
                      </div>
                    )}
                    {(answer.improvements || answer.aiFeedback?.improvements)?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-amber-700">Improve: </span>
                        <span className="text-xs text-gray-600">
                          {(answer.improvements || answer.aiFeedback?.improvements).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${
                    score >= 75 ? 'bg-green-100 text-green-700' :
                    score >= 50 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {score}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/interview/start" className="btn-primary flex items-center justify-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Practice Again
        </Link>
        <Link to="/progress" className="btn-outline flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5" />
          View Progress
        </Link>
        <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2">
          <Home className="h-5 w-5" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default InterviewResults;
