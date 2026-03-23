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
  TrendingUp,
  Share2,
  Download,
  Calendar,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't locate the interview session you're looking for.</p>
          <Link to="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const overallScore = session.overallScore || 
    (answers.length > 0 
      ? Math.round(answers.reduce((sum, a) => sum + (a.feedback?.overallScore || 0), 0) / answers.length)
      : 0);

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'Excellent!', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' };
    if (score >= 80) return { grade: 'A', label: 'Great Job!', color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' };
    if (score >= 70) return { grade: 'B', label: 'Good Work!', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
    if (score >= 60) return { grade: 'C', label: 'Keep Practicing', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
    return { grade: 'D', label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  const { grade, label, color, bg, border } = getScoreGrade(overallScore);

  // Prepare data for the chart
  const chartData = (session.answers || answers).map((answer, index) => ({
    name: `Q${index + 1}`,
    score: answer.score || answer.feedback?.overallScore || answer.aiFeedback?.overallScore || 0,
    fullMark: 100
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-indigo-600 font-medium">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header / Hero Section */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Results</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto md:mx-0 leading-relaxed">
                  You've successfully completed the <span className="font-semibold text-gray-800 capitalize">{session.type}</span> interview. Here's a detailed breakdown of your performance.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{Math.round((session.totalTime || 0) / 60)} mins duration</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>{session.completedQuestions || answers.length} questions answered</span>
                  </div>
                </div>
              </div>

              {/* Score Circle */}
              <div className="relative flex-shrink-0 group">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-gray-50 relative z-10 transition-transform duration-500 group-hover:scale-105">
                  <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90 drop-shadow-md">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 45}%`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - overallScore / 100)}%`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <span className="block text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
                      {overallScore}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
              </div>

            </div>
          </div>
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 transition-shadow hover:shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                    Performance Breakdown
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Score distribution for each question answered.</p>
                </div>
             </div>
             
             <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score >= 80 ? '#4f46e5' : entry.score >= 60 ? '#818cf8' : '#cbd5e1'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             </div>
          </div>

          {/* Feedback Summary Card */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col h-full transition-shadow hover:shadow-xl">
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Executive Summary
             </h3>
             
             <div className={`p-8 rounded-2xl ${bg} ${border} border mb-6 text-center flex-grow flex flex-col justify-center items-center`}>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Grade Achieved</p>
                <p className={`text-5xl font-black ${color} mb-3 tracking-tighter`}>{grade}</p>
                <div className={`px-4 py-1 rounded-full text-sm font-bold bg-white/50 backdrop-blur-sm ${color}`}>
                  {label}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-600">Response Accuracy</span>
                  <span className="font-bold text-gray-900">85%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-600">Communication</span>
                  <span className="font-bold text-gray-900">92%</span>
                </div>
                
                <Link to="/progress" className="mt-4 flex items-center justify-center w-full py-3.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                   <span>View Detailed Analytics</span>
                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
          </div>

        </div>

        {/* Question Details List */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Detailed Analysis</h3>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
                  <Download className="w-4 h-4" />
                  Export
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-all shadow-sm">
                  <Share2 className="w-4 h-4" />
                  Share
               </button>
            </div>
          </div>

          <div className="grid gap-6">
            {(session.answers || answers).map((answer, index) => {
              const score = answer.score || answer.feedback?.overallScore || answer.aiFeedback?.overallScore || 0;
              const questionText = answer.questionText || answer.question?.question || `Question ${index + 1}`;
              
              return (
                <div key={index} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      
                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold text-lg shadow-inner">
                            {index + 1}
                          </span>
                          <h4 className="text-lg font-bold text-gray-900 leading-snug pt-1">
                            {questionText}
                          </h4>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6 pl-14">
                          {(answer.strengths || answer.aiFeedback?.strengths)?.length > 0 && (
                            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                              <h5 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3 uppercase tracking-wide">
                                <CheckCircle className="w-4 h-4" /> Strong Points
                              </h5>
                              <ul className="space-y-3">
                                {(answer.strengths || answer.aiFeedback?.strengths).map((s, i) => (
                                  <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-sm"></span>
                                    <span className="leading-relaxed">{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {(answer.improvements || answer.aiFeedback?.improvements)?.length > 0 && (
                            <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50 hover:border-amber-200 transition-colors">
                              <h5 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3 uppercase tracking-wide">
                                <Target className="w-4 h-4" /> Areas to Improve
                              </h5>
                              <ul className="space-y-3">
                                {(answer.improvements || answer.aiFeedback?.improvements).map((s, i) => (
                                  <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 shadow-sm"></span>
                                    <span className="leading-relaxed">{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Score Indicator */}
                      <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 md:pl-8 md:border-l md:border-gray-100 min-w-[140px]">
                        <div className="text-right">
                          <span className="block text-4xl font-black text-gray-900">{score}%</span>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Params Score</span>
                        </div>
                        <div className="flex-1 md:flex-none w-full md:w-2 bg-gray-100 rounded-full h-3 md:h-32 overflow-hidden relative">
                           {/* Vertical bar for desktop, horizontal for mobile */}
                           <div className="hidden md:block absolute bottom-0 left-0 w-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                  height: `${score}%`,
                                  backgroundColor: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444' 
                                }}
                           ></div>
                           <div className="block md:hidden absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                  width: `${score}%`,
                                  backgroundColor: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444' 
                                }}
                           ></div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Bottom Navigation */}
        <div className="sticky bottom-8 z-30 flex justify-center pointer-events-none">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-full p-2 pl-6 pr-2 shadow-2xl flex items-center gap-4 text-white border border-gray-700/50 pointer-events-auto transform hover:scale-105 transition-transform duration-300">
             <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-300">Ready for your next challenge?</p>
             </div>
             <div className="flex items-center gap-2">
                <Link to="/dashboard" className="px-4 py-2.5 rounded-full hover:bg-gray-800 text-sm font-semibold transition-all text-center">
                   Dashboard
                </Link>
                <Link to="/interview/start" className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                   <RotateCcw className="w-4 h-4" />
                   Start New Session
                </Link>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default InterviewResults;
