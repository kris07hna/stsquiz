import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, XCircle, BookOpen, FileText, BarChart3, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useQuizStore from '../store/quizStore';

const QuizInterface = () => {
  const {
    questions,
    allQuestions,
    selectedTopics,
    currentQuestionIndex,
    answers,
    timeLeft,
    isTimerActive,
    setCurrentQuestion,
    setAnswer,
    nextQuestion,
    previousQuestion,
    setTimeLeft,
    setSelectedTopics,
    getAvailableTopics,
    finishQuiz,
    getScore
  } = useQuizStore();

  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showSolutions, setShowSolutions] = useState(false);
  const [currentTab, setCurrentTab] = useState('question');
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  
  const availableTopics = getAvailableTopics();
  
  const toggleTopic = (topic) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    setSelectedTopics(newTopics);
  };

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentQuestionIndex < questions.length - 1) {
              nextQuestion();
              return 60;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  const normalizeAnswer = (ans) => {
    if (!ans) return '';
    const str = ans.toString().trim().toUpperCase();
    if (/^[1-4]$/.test(str)) {
      return String.fromCharCode(64 + parseInt(str));
    }
    return str;
  };

  const correctAnswer = normalizeAnswer(currentQuestion.answer_key);
  const selectedAnswer = answers[currentQuestionIndex];
  const selectedNorm = normalizeAnswer(selectedAnswer);
  const isCorrect = selectedNorm === correctAnswer;

  const choices = [
    { label: 'A', text: currentQuestion.choice_1 },
    { label: 'B', text: currentQuestion.choice_2 },
    { label: 'C', text: currentQuestion.choice_3 },
    { label: 'D', text: currentQuestion.choice_4 }
  ];

  const handleAnswerSelect = (choice) => {
    setAnswer(currentQuestionIndex, choice);
  };

  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(([idx, ans]) => {
    const q = questions[idx];
    return normalizeAnswer(ans) === normalizeAnswer(q.answer_key);
  }).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '0'
    }}>
      {/* TestBook-style Header */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e0e0e0',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            testbook
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Quiz Practice
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#17a2b8',
            fontWeight: '600',
            background: '#e7f5ff',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {questions.length} of {allQuestions.length} questions
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => setShowTopicFilter(!showTopicFilter)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: showTopicFilter ? '#17a2b8' : '#f8f9fa',
              color: showTopicFilter ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={16} />
            Topics ({selectedTopics.length}/{availableTopics.length})
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <Clock size={18} />
            <span style={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
          </div>
          
          <button
            onClick={() => finishQuiz()}
            style={{
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Topic Filter Panel */}
      {showTopicFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: 'white',
            borderBottom: '2px solid #e0e0e0',
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#333', fontWeight: '600' }}>
                Filter Questions by Topic
              </h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedTopics(availableTopics)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e0e0e0',
                    background: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedTopics([])}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e0e0e0',
                    background: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {availableTopics.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                const topicCount = allQuestions.filter(q => (q.Topic || 'General') === topic).length;
                
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: '8px 16px',
                      border: `2px solid ${isSelected ? '#17a2b8' : '#e0e0e0'}`,
                      background: isSelected ? '#e7f5ff' : 'white',
                      color: isSelected ? '#17a2b8' : '#666',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isSelected && <CheckCircle size={14} />}
                    {topic} ({topicCount})
                  </button>
                );
              })}
            </div>
            
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#666'
            }}>
              <strong>{questions.length}</strong> questions selected out of <strong>{allQuestions.length}</strong> total
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Section Tabs */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            marginBottom: '20px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #e0e0e0'
            }}>
              <button
                onClick={() => setCurrentTab('question')}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: currentTab === 'question' ? '#17a2b8' : 'white',
                  color: currentTab === 'question' ? 'white' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                Question
              </button>
              <button
                onClick={() => setCurrentTab('solutions')}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: currentTab === 'solutions' ? '#17a2b8' : 'white',
                  color: currentTab === 'solutions' ? 'white' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                Solutions
              </button>
              <button
                onClick={() => setCurrentTab('summary')}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: currentTab === 'summary' ? '#17a2b8' : 'white',
                  color: currentTab === 'summary' ? 'white' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                Summary
              </button>
            </div>

            {/* Question Content */}
            {currentTab === 'question' && (
              <div style={{ padding: '30px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#17a2b8',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      Question No. {currentQuestionIndex + 1}
                    </span>
                    <span style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      Marks: {currentQuestion.Marks || 1}
                    </span>
                    {currentQuestion.Topic && (
                      <span style={{
                        background: '#6f42c1',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        📚 {currentQuestion.Topic}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={toggleFlag}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: flaggedQuestions.has(currentQuestionIndex) ? '#ff6b6b' : '#999',
                      fontSize: '14px'
                    }}
                  >
                    <Flag size={18} fill={flaggedQuestions.has(currentQuestionIndex) ? '#ff6b6b' : 'none'} />
                    Flag
                  </button>
                </div>

                {/* Question Text */}
                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: '#333',
                  marginBottom: '30px',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  borderLeft: '4px solid #17a2b8'
                }}>
                  {currentQuestion.Question_Text}
                </div>

                {/* Answer Choices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  {choices.map((choice) => {
                    const isSelected = selectedNorm === choice.label;
                    const isCorrectChoice = correctAnswer === choice.label;
                    const showCorrect = selectedAnswer && isCorrectChoice;
                    const showIncorrect = isSelected && !isCorrect && selectedAnswer;

                    return (
                      <motion.div
                        key={choice.label}
                        whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                        onClick={() => !selectedAnswer && handleAnswerSelect(choice.label)}
                        style={{
                          padding: '16px 20px',
                          border: showCorrect ? '2px solid #28a745' :
                                 showIncorrect ? '2px solid #dc3545' :
                                 isSelected ? '2px solid #17a2b8' : '2px solid #e0e0e0',
                          borderRadius: '8px',
                          cursor: selectedAnswer ? 'default' : 'pointer',
                          background: showCorrect ? '#d4edda' :
                                     showIncorrect ? '#f8d7da' :
                                     isSelected ? '#e7f5ff' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: showCorrect ? '2px solid #28a745' :
                                 showIncorrect ? '2px solid #dc3545' :
                                 isSelected ? '2px solid #17a2b8' : '2px solid #ccc',
                          background: showCorrect ? '#28a745' :
                                     showIncorrect ? '#dc3545' :
                                     isSelected ? '#17a2b8' : 'white',
                          color: (isSelected || showCorrect || showIncorrect) ? 'white' : '#333',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          flexShrink: 0
                        }}>
                          {choice.label}
                        </div>
                        <div style={{ flex: 1, fontSize: '15px', color: '#333' }}>
                          {choice.text}
                        </div>
                        {showCorrect && (
                          <CheckCircle size={22} color="#28a745" style={{ flexShrink: 0 }} />
                        )}
                        {showIncorrect && (
                          <XCircle size={22} color="#dc3545" style={{ flexShrink: 0 }} />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Solution Display - Shows after answer is selected */}
                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ marginTop: '20px' }}
                  >
                    <div style={{
                      borderTop: '2px solid #e0e0e0',
                      paddingTop: '25px'
                    }}>
                      <h3 style={{ 
                        margin: '0 0 20px 0', 
                        color: '#333',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <BookOpen size={22} color="#17a2b8" />
                        Solution
                      </h3>

                      {/* Correct Answer Display */}
                      <div style={{
                        padding: '20px',
                        background: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px'
                        }}>
                          <CheckCircle size={20} color="#155724" />
                          <span style={{ fontWeight: 'bold', color: '#155724', fontSize: '15px' }}>Correct Answer:</span>
                        </div>
                        <div style={{ fontSize: '15px', color: '#155724', paddingLeft: '30px' }}>
                          <strong>{correctAnswer}</strong>: {choices.find(c => c.label === correctAnswer)?.text || 'N/A'}
                        </div>
                      </div>

                      {/* User's Answer Status */}
                      <div style={{
                        padding: '20px',
                        background: isCorrect ? '#d4edda' : '#f8d7da',
                        border: isCorrect ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px'
                        }}>
                          {isCorrect ? <CheckCircle size={20} color="#155724" /> : <XCircle size={20} color="#721c24" />}
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: isCorrect ? '#155724' : '#721c24',
                            fontSize: '15px'
                          }}>
                            Your Answer: {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                          </span>
                        </div>
                        <div style={{ 
                          fontSize: '15px', 
                          color: isCorrect ? '#155724' : '#721c24',
                          paddingLeft: '30px'
                        }}>
                          <strong>{selectedNorm}</strong>: {choices.find(c => c.label === selectedNorm)?.text || 'N/A'}
                        </div>
                      </div>

                      {/* Explanation */}
                      {currentQuestion.Solution && (
                        <div style={{
                          padding: '20px',
                          background: '#e7f3ff',
                          border: '1px solid #b8daff',
                          borderRadius: '8px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '12px'
                          }}>
                            <FileText size={20} color="#004085" />
                            <span style={{ fontWeight: 'bold', color: '#004085', fontSize: '15px' }}>Explanation:</span>
                          </div>
                          <div style={{ 
                            fontSize: '15px', 
                            lineHeight: '1.7', 
                            color: '#004085',
                            paddingLeft: '30px'
                          }}>
                            {currentQuestion.Solution}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Solutions Tab */}
            {currentTab === 'solutions' && (
              <div style={{ padding: '30px' }}>
                <div style={{
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Solution:</h3>
                </div>

                {/* Correct Answer Display */}
                <div style={{
                  padding: '20px',
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <CheckCircle size={20} color="#155724" />
                    <span style={{ fontWeight: 'bold', color: '#155724' }}>Correct Answer:</span>
                  </div>
                  <div style={{ fontSize: '15px', color: '#155724' }}>
                    {correctAnswer}: {choices.find(c => c.label === correctAnswer)?.text || 'N/A'}
                  </div>
                </div>

                {/* User's Answer (if answered) */}
                {selectedAnswer && (
                  <div style={{
                    padding: '20px',
                    background: isCorrect ? '#d4edda' : '#f8d7da',
                    border: isCorrect ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px'
                    }}>
                      {isCorrect ? <CheckCircle size={20} color="#155724" /> : <XCircle size={20} color="#721c24" />}
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: isCorrect ? '#155724' : '#721c24' 
                      }}>
                        Your Answer: {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '15px', 
                      color: isCorrect ? '#155724' : '#721c24' 
                    }}>
                      {selectedNorm}: {choices.find(c => c.label === selectedNorm)?.text || 'N/A'}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {currentQuestion.Solution && (
                  <div style={{
                    padding: '20px',
                    background: '#e7f3ff',
                    border: '1px solid #b8daff',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px'
                    }}>
                      <BookOpen size={20} color="#004085" />
                      <span style={{ fontWeight: 'bold', color: '#004085' }}>Explanation:</span>
                    </div>
                    <div style={{ fontSize: '15px', lineHeight: '1.7', color: '#004085' }}>
                      {currentQuestion.Solution}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Tab */}
            {currentTab === 'summary' && (
              <div style={{ padding: '30px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    padding: '20px',
                    background: '#e7f5ff',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>
                      {answeredCount}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                      Answered
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '20px',
                    background: '#d4edda',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                      {correctCount}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                      Correct
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '20px',
                    background: '#f8d7da',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                      {answeredCount - correctCount}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                      Incorrect
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '20px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#856404' }}>
                      {questions.length - answeredCount}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                      Unattempted
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}>
            <button
              onClick={() => currentQuestionIndex > 0 && previousQuestion()}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '10px 24px',
                borderRadius: '6px',
                background: currentQuestionIndex === 0 ? '#e0e0e0' : 'white',
                color: currentQuestionIndex === 0 ? '#999' : '#333',
                border: '2px solid #e0e0e0',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <button
              onClick={() => currentQuestionIndex < questions.length - 1 && nextQuestion()}
              disabled={currentQuestionIndex === questions.length - 1}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '6px',
                background: currentQuestionIndex === questions.length - 1 ? '#e0e0e0' : '#17a2b8',
                color: 'white',
                cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Sidebar - Question Grid */}
        <div style={{
          width: '320px',
          background: 'white',
          borderLeft: '1px solid #e0e0e0',
          padding: '20px',
          position: 'sticky',
          top: '60px',
          height: 'calc(100vh - 60px)',
          overflowY: 'auto'
        }}>
          <div style={{
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
              Section: English
            </h3>
            
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#28a745'
                }}></div>
                <span style={{ color: '#666' }}>Correct</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#dc3545'
                }}></div>
                <span style={{ color: '#666' }}>Incorrect</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #ccc',
                  background: 'white'
                }}></div>
                <span style={{ color: '#666' }}>Unattempted</span>
              </div>
            </div>
          </div>

          {/* Question Number Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px'
          }}>
            {questions.map((_, index) => {
              const answered = answers[index] !== undefined;
              const isCurrentQ = index === currentQuestionIndex;
              const isFlagged = flaggedQuestions.has(index);
              
              let bgColor = 'white';
              let borderColor = '#ccc';
              let textColor = '#333';
              
              if (answered) {
                const q = questions[index];
                const userAns = normalizeAnswer(answers[index]);
                const correct = normalizeAnswer(q.answer_key);
                if (userAns === correct) {
                  bgColor = '#28a745';
                  borderColor = '#28a745';
                  textColor = 'white';
                } else {
                  bgColor = '#dc3545';
                  borderColor = '#dc3545';
                  textColor = 'white';
                }
              }
              
              if (isCurrentQ) {
                borderColor = '#17a2b8';
                if (!answered) {
                  bgColor = '#e7f5ff';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => jumpToQuestion(index)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: `2px solid ${borderColor}`,
                    background: bgColor,
                    color: textColor,
                    fontWeight: isCurrentQ ? 'bold' : '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s',
                    boxShadow: isCurrentQ ? '0 0 0 3px rgba(23, 162, 184, 0.2)' : 'none'
                  }}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag 
                      size={12} 
                      fill="#ff6b6b" 
                      color="#ff6b6b"
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
