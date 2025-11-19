import React, { useState } from 'react';
import { AlertTriangle, BookOpen, X, RotateCcw, TrendingUp, Target, CheckCircle2, XCircle, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useQuizStore from '../store/quizStore';

const WrongAnswersRecap = () => {
  const { 
    wrongAnswers, 
    showRecap, 
    setShowRecap, 
    questions,
    setCurrentQuestion,
    quizMode,
    getScore,
    startRecapQuiz
  } = useQuizStore();

  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [filterTopic, setFilterTopic] = useState('all');

  if (!showRecap) return null;

  const score = getScore();
  
  // Group wrong answers by topic
  const wrongByTopic = wrongAnswers.reduce((acc, wa) => {
    const topic = wa.topic || 'General';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(wa);
    return acc;
  }, {});

  const topics = Object.keys(wrongByTopic);
  const filteredTopics = filterTopic === 'all' ? topics : topics.filter(topic => topic === filterTopic);

  const toggleTopic = (topic) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };

  const reviewQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    setShowRecap(false);
  };

  const getChoiceText = (choiceKey, question) => {
    if (!choiceKey) return 'Not answered';
    
    const choiceMap = {
      'A': question.choice_1,
      'B': question.choice_2, 
      'C': question.choice_3,
      'D': question.choice_4,
      '1': question.choice_1,
      '2': question.choice_2,
      '3': question.choice_3,
      '4': question.choice_4
    };
    
    const key = choiceKey.toString().toUpperCase();
    return choiceMap[key] || choiceKey;
  };

  const normalizeAnswerKey = (answer) => {
    if (!answer) return '';
    const str = answer.toString().trim().toUpperCase();
    // Convert numbers to letters for display consistency
    if (/^[1-4]$/.test(str)) {
      return String.fromCharCode(64 + parseInt(str)); // 1->A, 2->B, etc.
    }
    return str;
  };

  const getTopicStats = (topic) => {
    const topicQuestions = questions.filter(q => (q.Topic || 'General') === topic);
    const topicWrong = wrongByTopic[topic]?.length || 0;
    const topicTotal = topicQuestions.length;
    const topicCorrect = topicTotal - topicWrong;
    return { correct: topicCorrect, wrong: topicWrong, total: topicTotal };
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Performance Review</h2>
                  <p className="text-red-100">Analyze your mistakes and improve</p>
                </div>
              </div>
              
              {/* Score Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{score.correct}</div>
                  <div className="text-sm text-red-100">Correct</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-200">{wrongAnswers.length}</div>
                  <div className="text-sm text-red-100">Wrong</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{score.attempted}</div>
                  <div className="text-sm text-red-100">Attempted</div>
                </div>
                <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{score.percentage.toFixed(1)}%</div>
                  <div className="text-sm text-red-100">Score</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowRecap(false)}
              className="text-white hover:text-red-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-gray-50 border-b px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by topic:</span>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Topics ({wrongAnswers.length} mistakes)</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic} ({wrongByTopic[topic]?.length || 0} mistakes)
                </option>
              ))}
            </select>
            
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setExpandedTopics(new Set(topics))}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandedTopics(new Set())}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {wrongAnswers.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-semibold text-green-700 mb-2">
                Perfect Performance!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Excellent work! You answered all questions correctly. Keep up the great work!
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filteredTopics.map(topic => {
                const topicWrongAnswers = wrongByTopic[topic] || [];
                const topicStats = getTopicStats(topic);
                const isExpanded = expandedTopics.has(topic);
                
                return (
                  <motion.div
                    key={topic}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Topic Header */}
                    <button
                      onClick={() => toggleTopic(topic)}
                      className="w-full bg-gray-50 hover:bg-gray-100 transition-colors p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          <BookOpen size={20} className="text-red-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800 text-lg">{topic}</h3>
                          <p className="text-sm text-gray-600">
                            {topicWrongAnswers.length} wrong out of {topicStats.total} questions
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Accuracy</div>
                          <div className="font-bold text-lg" style={{ 
                            color: topicStats.total > 0 ? 
                              ((topicStats.correct / topicStats.total) * 100 >= 70 ? '#10b981' : '#ef4444') : 
                              '#6b7280'
                          }}>
                            {topicStats.total > 0 ? `${((topicStats.correct / topicStats.total) * 100).toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {topicWrongAnswers.length} mistakes
                        </div>
                      </div>
                    </button>
                    
                    {/* Topic Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="p-4 space-y-4">
                            {topicWrongAnswers.map((wa, index) => (
                              <motion.div
                                key={`${wa.questionIndex}-${index}`}
                                className="bg-red-50 border border-red-200 rounded-lg p-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                                        Q{wa.questionIndex + 1}
                                      </span>
                                      {wa.questionId && (
                                        <span className="text-gray-500 text-xs">
                                          ID: {wa.questionId}
                                        </span>
                                      )}
                                      <span className="text-gray-500 text-xs">
                                        {wa.marks} mark{wa.marks !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                    <h4 className="font-medium text-gray-900 mb-3 leading-relaxed">
                                      {wa.questionText}
                                    </h4>
                                  </div>
                                  
                                  <button
                                    onClick={() => reviewQuestion(wa.questionIndex)}
                                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                  >
                                    <RotateCcw size={14} />
                                    Review
                                  </button>
                                </div>
                                
                                {/* Answer Comparison */}
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <XCircle size={16} className="text-red-600" />
                                      <span className="font-medium text-red-700">Your Answer</span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="font-bold text-red-800">{wa.selectedAnswer}</span>: {wa.selectedAnswerText}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <CheckCircle2 size={16} className="text-green-600" />
                                      <span className="font-medium text-green-700">Correct Answer</span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="font-bold text-green-800">{wa.correctAnswer}</span>: {wa.correctAnswerText}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Solution */}
                                {wa.solution && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Target size={16} className="text-blue-600" />
                                      <span className="font-medium text-blue-700">Explanation</span>
                                    </div>
                                    <p className="text-sm text-blue-800 leading-relaxed">{wa.solution}</p>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {wrongAnswers.length > 0 ? (
              `Review ${wrongAnswers.length} mistake${wrongAnswers.length !== 1 ? 's' : ''} to improve your performance`
            ) : (
              'No mistakes to review - excellent work!'
            )}
          </div>
          <div className="flex gap-3">
            {wrongAnswers.length > 0 && (
              <button
                onClick={() => {
                  startRecapQuiz();
                  setShowRecap(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Play size={16} />
                Practice Wrong Questions
              </button>
            )}
            <button
              onClick={() => setShowRecap(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continue Quiz
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WrongAnswersRecap;