import React from 'react';
import { CheckCircle, XCircle, Info, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import useQuizStore from '../store/quizStore';

const AnswerFeedback = ({ questionIndex }) => {
  const { questions, answers, showFeedback, quizMode, testCompleted } = useQuizStore();
  
  // Show feedback in practice mode immediately, or in test mode after completion
  const shouldShowFeedback = (quizMode === 'practice' && showFeedback) || (quizMode === 'test' && testCompleted);
  
  if (!shouldShowFeedback || !questions[questionIndex]) return null;
  
  const question = questions[questionIndex];
  const userAnswer = answers[questionIndex];
  const correctAnswer = question.answer_key?.toString().trim().toUpperCase();
  const userAnswerNormalized = userAnswer?.toString().trim().toUpperCase();
  const isCorrect = userAnswerNormalized === correctAnswer;
  
  const getChoiceText = (choiceKey) => {
    if (!choiceKey) return 'No answer selected';
    const choiceMap = {
      'A': question.choice_1,
      'B': question.choice_2,
      'C': question.choice_3,
      'D': question.choice_4
    };
    return choiceMap[choiceKey.toString().trim().toUpperCase()] || choiceKey;
  };

  return (
    <motion.div 
      className={`mt-4 rounded-xl border-l-4 overflow-hidden ${
        isCorrect 
          ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-500' 
          : 'bg-gradient-to-r from-red-50 to-red-100 border-red-500'
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <motion.div 
            className={`p-2 rounded-full ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
          >
            {isCorrect ? (
              <CheckCircle className="text-green-700" size={24} />
            ) : (
              <XCircle className="text-red-700" size={24} />
            )}
          </motion.div>
          
          <div className="flex-1">
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className={`text-xl font-bold ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
              </h4>
              <div className="flex items-center gap-2">
                {quizMode === 'practice' && (
                  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                    Practice Mode
                  </span>
                )}
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  isCorrect 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {question.Marks || 1} mark{(question.Marks || 1) !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
            
            {/* Answer Comparison */}
            <motion.div 
              className="grid md:grid-cols-2 gap-4 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* User's Answer */}
              <div className={`p-3 rounded-lg border-2 ${
                isCorrect 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-red-300 bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className={isCorrect ? 'text-green-600' : 'text-red-600'} />
                  <span className={`font-medium text-sm ${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Your Answer
                  </span>
                </div>
                <div className={`text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  <span className="font-bold">{userAnswer || 'Not answered'}</span>
                  {userAnswer && (
                    <div className="mt-1 text-xs opacity-75">
                      {getChoiceText(userAnswer)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Correct Answer */}
              <div className="p-3 rounded-lg border-2 border-green-300 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="font-medium text-sm text-green-700">
                    Correct Answer
                  </span>
                </div>
                <div className="text-sm text-green-800">
                  <span className="font-bold">{correctAnswer}</span>
                  <div className="mt-1 text-xs opacity-75">
                    {getChoiceText(correctAnswer)}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Solution Explanation */}
            {question.Solution && (
              <motion.div 
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-blue-200 rounded">
                    <Info className="text-blue-600" size={16} />
                  </div>
                  <h5 className="font-semibold text-blue-800">Explanation</h5>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {question.Solution}
                </p>
              </motion.div>
            )}

            {/* Performance Tip */}
            {!isCorrect && (
              <motion.div 
                className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-xs text-yellow-700">
                  💡 <strong>Tip:</strong> This question will be saved for review. Study the explanation to improve your understanding of <strong>{question.Topic || 'this topic'}</strong>.
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnswerFeedback;