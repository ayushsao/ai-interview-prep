import { create } from 'zustand';
import { interviewAPI, questionsAPI } from '../services/api';

export const useInterviewStore = create((set, get) => ({
  currentSession: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isLoading: false,
  error: null,
  feedback: null,

  startInterview: async (config) => {
    set({ isLoading: true, error: null });
    try {
      const response = await interviewAPI.start(config);
      const { session, questions } = response.data;
      
      set({
        currentSession: session,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        isLoading: false,
        feedback: null
      });
      
      return { success: true, sessionId: session.id };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to start interview';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  submitAnswer: async (answerData) => {
    set({ isLoading: true, error: null, feedback: null });
    try {
      const { currentSession, questions, currentQuestionIndex } = get();
      const currentQuestion = questions[currentQuestionIndex];
      
      const response = await interviewAPI.submitAnswer(currentSession.id, {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        category: currentQuestion.category,
        expectedTopics: currentQuestion.expectedTopics || [],
        ...answerData
      });
      
      const { feedback, progress } = response.data;
      
      set(state => ({
        answers: [...state.answers, { question: currentQuestion, feedback, answer: answerData.userAnswer }],
        feedback,
        isLoading: false,
        currentSession: { ...state.currentSession, ...progress }
      }));
      
      return { success: true, feedback };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to submit answer';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  nextQuestion: () => {
    set(state => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      feedback: null
    }));
  },

  completeInterview: async () => {
    set({ isLoading: true });
    try {
      const { currentSession } = get();
      const response = await interviewAPI.complete(currentSession.id);
      
      set({ isLoading: false });
      return { success: true, summary: response.data.summary };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  getSession: async (sessionId) => {
    set({ isLoading: true });
    try {
      const response = await interviewAPI.getSession(sessionId);
      set({ currentSession: response.data, isLoading: false });
      return { success: true, session: response.data };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  },

  reset: () => {
    set({
      currentSession: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      feedback: null,
      error: null
    });
  }
}));
