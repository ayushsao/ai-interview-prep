import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore';
import { 
  PlayCircle, 
  Users, 
  Code, 
  Shuffle,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

function StartInterview() {
  const [config, setConfig] = useState({
    type: 'mixed',
    difficulty: 'medium',
    questionCount: 5,
    techStack: []
  });
  const { startInterview, isLoading, error } = useInterviewStore();
  const navigate = useNavigate();

  const interviewTypes = [
    { id: 'hr', label: 'HR Interview', icon: Users, description: 'Behavioral and situational questions' },
    { id: 'technical', label: 'Technical Interview', icon: Code, description: 'Technical and coding questions' },
    { id: 'mixed', label: 'Mixed Interview', icon: Shuffle, description: 'Combination of HR and technical' }
  ];

  const difficultyLevels = [
    { id: 'easy', label: 'Easy', description: 'Entry-level questions' },
    { id: 'medium', label: 'Medium', description: 'Mid-level questions' },
    { id: 'hard', label: 'Hard', description: 'Senior-level questions' }
  ];

  const techStackOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'System Design'
  ];

  const toggleTechStack = (tech) => {
    setConfig(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleStart = async () => {
    const result = await startInterview(config);
    if (result.success) {
      navigate(`/interview/${result.sessionId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Start New Interview</h1>
        <p className="text-gray-600 mt-1">Configure your mock interview session</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Interview Type */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview Type</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = config.type === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setConfig({ ...config, type: type.id })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-8 w-8 mb-3 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                  {type.label}
                </p>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</h2>
        <div className="flex gap-4">
          {difficultyLevels.map((level) => {
            const isSelected = config.difficulty === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setConfig({ ...config, difficulty: level.id })}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                  {level.label}
                </p>
                <p className="text-sm text-gray-600">{level.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Number of Questions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Number of Questions</h2>
        <div className="flex gap-3">
          {[3, 5, 7, 10].map((count) => (
            <button
              key={count}
              onClick={() => setConfig({ ...config, questionCount: count })}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                config.questionCount === count
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack (for technical interviews) */}
      {(config.type === 'technical' || config.type === 'mixed') && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tech Stack (Optional)</h2>
          <p className="text-sm text-gray-600 mb-4">Select technologies you want to focus on</p>
          <div className="flex flex-wrap gap-2">
            {techStackOptions.map((tech) => {
              const isSelected = config.techStack.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => toggleTechStack(tech)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Start Button */}
      <div className="flex justify-end">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Preparing Interview...
            </>
          ) : (
            <>
              <PlayCircle className="h-5 w-5" />
              Start Interview
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default StartInterview;
