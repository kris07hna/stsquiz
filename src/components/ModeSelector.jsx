import React from 'react';
import { BookOpen, Target, RotateCcw } from 'lucide-react';
import useQuizStore from '../store/quizStore';

const ModeSelector = () => {
  const { quizMode, setQuizMode, resetQuiz } = useQuizStore();

  const handleModeChange = (mode) => {
    resetQuiz();
    setQuizMode(mode);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Choose Quiz Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleModeChange('practice')}
          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            quizMode === 'practice'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-center mb-2">
            <BookOpen size={32} />
          </div>
          <h4 className="font-semibold mb-2">Practice Mode</h4>
          <p className="text-sm">
            Get immediate feedback after each answer. Perfect for learning and understanding concepts.
          </p>
          <ul className="text-xs mt-3 space-y-1">
            <li>✓ Instant answer feedback</li>
            <li>✓ Solution explanations</li>
            <li>✓ Learn as you go</li>
          </ul>
        </button>

        <button
          onClick={() => handleModeChange('test')}
          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            quizMode === 'test'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300'
          }`}
        >
          <div className="flex items-center justify-center mb-2">
            <Target size={32} />
          </div>
          <h4 className="font-semibold mb-2">Test Mode</h4>
          <p className="text-sm">
            Take a real test experience. Get results and feedback only after completion.
          </p>
          <ul className="text-xs mt-3 space-y-1">
            <li>✓ Exam-like environment</li>
            <li>✓ Final score and analysis</li>
            <li>✓ Wrong answer review</li>
          </ul>
        </button>
      </div>

      {quizMode && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">
            Current mode: <span className="capitalize text-blue-600">{quizMode}</span>
          </span>
          <button
            onClick={() => resetQuiz()}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;