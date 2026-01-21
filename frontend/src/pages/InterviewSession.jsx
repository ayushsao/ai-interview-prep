import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore';
import { 
  Clock, 
  ChevronRight, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  ThumbsUp,
  Target,
  Lightbulb
} from 'lucide-react';

function InterviewSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const textareaRef = useRef(null);

  const {
    currentSession,
    questions,
    currentQuestionIndex,
    feedback,
    isLoading,
    submitAnswer,
    nextQuestion,
    completeInterview
  } = useInterviewStore();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (!currentSession || questions.length === 0) {
      navigate('/interview/start');
    }
  }, [currentSession, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (feedback) {
      setShowFeedback(true);
    }
  }, [feedback]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    await submitAnswer({
      userAnswer: answer,
      timeSpent: timeElapsed
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleComplete();
    } else {
      nextQuestion();
      setAnswer('');
      setTimeElapsed(0);
      setShowFeedback(false);
      textareaRef.current?.focus();
    }
  };

  const handleComplete = async () => {
    await completeInterview();
    navigate(`/interview/${sessionId}/results`);
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium capitalize ${
            currentQuestion.category === 'hr' ? 'bg-blue-100 text-blue-700' :
            currentQuestion.category === 'technical' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {currentQuestion.category}
          </span>
          {currentQuestion.difficulty && (
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {currentQuestion.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-5 w-5" />
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {currentQuestion.question}
        </h2>
        
        {currentQuestion.tips && currentQuestion.tips.length > 0 && !showFeedback && (
          <div className="mt-4 bg-amber-50 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-900 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Tips:
            </p>
            <ul className="mt-2 space-y-1">
              {currentQuestion.tips.map((tip, i) => (
                <li key={i} className="text-sm text-amber-700">• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Answer Input or Feedback */}
      {!showFeedback ? (
        <div className="card">
          <label className="label">Your Answer</label>
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="input min-h-[200px] resize-none"
            placeholder="Type your answer here... Be detailed and specific."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {answer.length} characters
            </p>
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score */}
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Score</p>
              <p className="text-3xl font-bold text-gray-900">{feedback?.overallScore}%</p>
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(feedback?.overallScore)}`}>
              {feedback?.overallScore >= 75 ? (
                <ThumbsUp className="h-10 w-10" />
              ) : feedback?.overallScore >= 50 ? (
                <Target className="h-10 w-10" />
              ) : (
                <AlertTriangle className="h-10 w-10" />
              )}
            </div>
          </div>

          {/* Your Answer */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Your Answer</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          </div>

          {/* Feedback */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">AI Feedback</h3>
            
            {feedback?.strengths?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-green-800 flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  Strengths
                </p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 pl-6">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback?.improvements?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-amber-800 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Areas to Improve
                </p>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 pl-6">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback?.detailedFeedback && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Detailed Feedback</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback.detailedFeedback}</p>
              </div>
            )}
          </div>

          {/* Suggested Answer */}
          {feedback?.suggestedAnswer && (
            <div className="card bg-primary-50 border-primary-200">
              <h3 className="font-semibold text-primary-900 mb-2">Model Answer</h3>
              <p className="text-primary-800 text-sm whitespace-pre-wrap">{feedback.suggestedAnswer}</p>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end">
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              {isLastQuestion ? 'Complete Interview' : 'Next Question'}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewSession;
