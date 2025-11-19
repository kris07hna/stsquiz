import { create } from 'zustand';

const useQuizStore = create((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  answerDetails: {}, // Detailed answer tracking
  showSolution: false,
  timeLeft: 0,
  isTimerActive: false,
  fontSize: 16,
  quizStarted: false,
  quizMode: 'practice', // 'practice' or 'test' or 'recap'
  wrongAnswers: [],
  mistakes: [], // Professional mistake tracking
  reviewMode: false,
  showRecap: false,
  testCompleted: false,
  showFeedback: false,
  isRecapMode: false,
  recapQuestions: [],

  setQuestions: (questions) => set({ 
    questions,
    currentQuestionIndex: 0,
    answers: {},
    wrongAnswers: [],
    testCompleted: false,
    showFeedback: false 
  }),
  
  setCurrentQuestion: (index) => set({ 
    currentQuestionIndex: index,
    showFeedback: false 
  }),
  
  setAnswer: (questionIndex, answer) => {
    const { answers, questions, quizMode } = get();
    const question = questions[questionIndex];
    
    // Normalize answers for comparison
    const normalizeAnswer = (ans) => {
      if (!ans) return '';
      const str = ans.toString().trim().toUpperCase();
      // Convert numbers to letters: 1->A, 2->B, 3->C, 4->D
      if (/^[1-4]$/.test(str)) {
        return String.fromCharCode(64 + parseInt(str)); // 1->A, 2->B, etc.
      }
      return str;
    };
    
    const normalizedUserAnswer = normalizeAnswer(answer);
    const normalizedCorrectAnswer = normalizeAnswer(question.answer_key);
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    
    console.log('Answer validation:', { 
      userAnswer: normalizedUserAnswer, 
      correctAnswer: normalizedCorrectAnswer, 
      isCorrect, 
      originalAnswer: answer,
      originalCorrect: question.answer_key,
      question: question.Question_Text?.substring(0, 50) + '...'
    });
    
    set({ 
      answers: { ...answers, [questionIndex]: normalizedUserAnswer },
      showFeedback: quizMode === 'practice'
    });
    
    // Track wrong answers in both modes
    if (!isCorrect) {
      get().addWrongAnswer(questionIndex, normalizedUserAnswer, normalizedCorrectAnswer);
    } else {
      get().removeWrongAnswer(questionIndex);
    }
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ 
        currentQuestionIndex: currentQuestionIndex + 1,
        showFeedback: false 
      });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ 
        currentQuestionIndex: currentQuestionIndex - 1,
        showFeedback: false 
      });
    }
  },
  
  toggleSolution: () => set((state) => ({ showSolution: !state.showSolution })),
  
  setTimeLeft: (time) => set({ timeLeft: time }),
  
  setTimerActive: (active) => set({ isTimerActive: active }),
  
  setFontSize: (size) => set({ fontSize: size }),
  
  updateSettings: (settings) => set({ 
    fontSize: settings.fontSize || 16 
  }),
  
  startQuiz: () => set({ quizStarted: true }),
  
  finishQuiz: () => {
    const { quizMode } = get();
    if (quizMode === 'test') {
      set({ testCompleted: true, showFeedback: true });
    }
  },
  
  resetQuiz: () => set({
    currentQuestionIndex: 0,
    answers: {},
    answerDetails: {},
    showSolution: false,
    timeLeft: 0,
    isTimerActive: false,
    quizStarted: false,
    wrongAnswers: [],
    mistakes: [],
    reviewMode: false,
    showRecap: false,
    testCompleted: false,
    showFeedback: false
  }),

  setQuizMode: (mode) => set({ quizMode: mode }),
  
  addWrongAnswer: (questionIndex, selectedAnswer, correctAnswer) => {
    const { wrongAnswers, questions } = get();
    const question = questions[questionIndex];
    
    // Map answer keys to choice text
    const getChoiceText = (choiceKey) => {
      const choiceMap = {
        'A': question.choice_1,
        'B': question.choice_2,
        'C': question.choice_3,
        'D': question.choice_4
      };
      return choiceMap[choiceKey?.toString().trim().toUpperCase()] || choiceKey;
    };
    
    const wrongAnswer = {
      questionIndex,
      questionId: question.Question_ID,
      questionText: question.Question_Text,
      selectedAnswer: selectedAnswer?.toString().trim().toUpperCase(),
      selectedAnswerText: getChoiceText(selectedAnswer),
      correctAnswer: correctAnswer?.toString().trim().toUpperCase(),
      correctAnswerText: getChoiceText(correctAnswer),
      topic: question.Topic || 'General',
      solution: question.Solution,
      marks: question.Marks || 1,
      timestamp: new Date().toISOString()
    };
    
    // Remove existing wrong answer for this question and add the new one
    const filteredWrongAnswers = wrongAnswers.filter(wa => wa.questionIndex !== questionIndex);
    set({ wrongAnswers: [...filteredWrongAnswers, wrongAnswer] });
  },
  
  removeWrongAnswer: (questionIndex) => {
    const { wrongAnswers } = get();
    set({ wrongAnswers: wrongAnswers.filter(wa => wa.questionIndex !== questionIndex) });
  },
  
  setShowRecap: (show) => set({ showRecap: show }),
  setTestCompleted: (completed) => set({ testCompleted: completed }),
  setShowFeedback: (show) => set({ showFeedback: show }),
  
  // Recap quiz methods
  startRecapQuiz: () => {
    const { wrongAnswers } = get();
    set({ 
      isRecapMode: true,
      recapQuestions: wrongAnswers,
      currentQuestionIndex: 0,
      answers: {},
      showFeedback: false,
      quizMode: 'recap'
    });
  },
  
  exitRecapQuiz: () => {
    set({ 
      isRecapMode: false,
      recapQuestions: [],
      currentQuestionIndex: 0,
      quizMode: 'practice'
    });
  },
  
  // Helper to normalize answers
  normalizeAnswer: (answer) => {
    if (typeof answer === 'string') {
      return answer.trim().toUpperCase();
    }
    if (typeof answer === 'number') {
      return ['A', 'B', 'C', 'D'][answer - 1] || 'A';
    }
    return 'A';
  },
  
  // Get quiz score and statistics
  getScore: () => {
    const { questions, answers } = get();
    let correct = 0;
    let attempted = 0;
    
    // Normalize answers for comparison
    const normalizeAnswer = (ans) => {
      if (!ans) return '';
      const str = ans.toString().trim().toUpperCase();
      // Convert numbers to letters: 1->A, 2->B, 3->C, 4->D
      if (/^[1-4]$/.test(str)) {
        return String.fromCharCode(64 + parseInt(str)); // 1->A, 2->B, etc.
      }
      return str;
    };
    
    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        attempted++;
        const normalizedCorrectAnswer = normalizeAnswer(question.answer_key);
        const normalizedUserAnswer = normalizeAnswer(answers[index]);
        if (normalizedUserAnswer === normalizedCorrectAnswer) {
          correct++;
        }
      }
    });
    
    return { 
      correct, 
      total: questions.length, 
      attempted,
      percentage: questions.length > 0 ? (correct / questions.length) * 100 : 0,
      wrong: attempted - correct,
      attemptedPercentage: questions.length > 0 ? (attempted / questions.length) * 100 : 0
    };
  },

  // Professional analytics and review methods
  getPerformanceAnalytics: () => {
    const { questions, answers, answerDetails, mistakes } = get();
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.values(answerDetails || {}).filter(detail => detail?.isCorrect).length;
    const incorrectAnswers = Object.values(answerDetails || {}).filter(detail => detail?.isCorrect === false).length;
    
    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy: answeredQuestions > 0 ? (correctAnswers / answeredQuestions * 100) : 0,
      completion: totalQuestions > 0 ? (answeredQuestions / totalQuestions * 100) : 0,
      mistakes: mistakes || [],
      averageTime: 0, // Could be enhanced with timing data
      strongTopics: [],
      weakTopics: []
    };
  },

  setReviewMode: (enabled) => set({ reviewMode: enabled }),
  
  addMistakeDetail: (questionIndex, selectedAnswer, correctAnswer, explanation) => {
    const { questions, mistakes } = get();
    const question = questions[questionIndex];
    
    const mistakeDetail = {
      id: Date.now() + Math.random(),
      questionIndex,
      questionText: question.Question_Text,
      selectedAnswer,
      correctAnswer,
      explanation: explanation || question.Solution || 'No explanation available',
      timestamp: new Date(),
      topic: question.Topic || 'General',
      reviewed: false
    };
    
    const existingIndex = mistakes.findIndex(m => m.questionIndex === questionIndex);
    const newMistakes = existingIndex >= 0 
      ? mistakes.map((m, i) => i === existingIndex ? mistakeDetail : m)
      : [...mistakes, mistakeDetail];
    
    set({ mistakes: newMistakes });
  },

  markMistakeAsReviewed: (mistakeId) => {
    const { mistakes } = get();
    set({ 
      mistakes: mistakes.map(m => 
        m.id === mistakeId ? { ...m, reviewed: true } : m
      )
    });
  },

  clearMistakes: () => set({ mistakes: [] })
}));

export default useQuizStore;