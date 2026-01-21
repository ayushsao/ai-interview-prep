import { Link } from 'react-router-dom';
import { Brain, CheckCircle, TrendingUp, MessageSquare, ArrowRight, Star } from 'lucide-react';

function Landing() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Mock Interviews',
      description: 'Practice with realistic HR and technical interview questions tailored to your experience level.'
    },
    {
      icon: Brain,
      title: 'AI Feedback',
      description: 'Get instant, detailed feedback on your answers with actionable improvement suggestions.'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement over time with detailed analytics and insights.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl text-gray-900">InterviewPrep AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Star className="h-4 w-4" />
          AI-Powered Interview Preparation
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Ace Your Next Interview<br />
          <span className="text-primary-600">With AI Coaching</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Practice mock interviews, get instant AI feedback, and track your improvement. 
          The smarter way to prepare for your dream job.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-lg">
            Start Practicing Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/login" className="btn-outline">
            I have an account
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: '500+', label: 'Interview Questions' },
            { value: '10K+', label: 'Practice Sessions' },
            { value: '85%', label: 'Success Rate' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Choose Interview Type', desc: 'Select HR, technical, or mixed interviews' },
            { step: 2, title: 'Answer Questions', desc: 'Respond to realistic interview questions' },
            { step: 3, title: 'Get AI Feedback', desc: 'Receive instant, detailed feedback' },
            { step: 4, title: 'Track & Improve', desc: 'Monitor progress and keep improving' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Interview?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of job seekers who improved their interview skills with AI.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary-600" />
            <span className="font-semibold text-gray-900">InterviewPrep AI</span>
          </div>
          <p className="text-sm text-gray-600">
            © 2026 InterviewPrep AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
