import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XCircle, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  BookOpen,
  TrendingUp,
  Target,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import useQuizStore from '../store/quizStore';

const MistakeReview = ({ onClose }) => {
  const { 
    mistakes, 
    markMistakeAsReviewed, 
    getPerformanceAnalytics,
    clearMistakes 
  } = useQuizStore();
  
  const [currentMistakeIndex, setCurrentMistakeIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewMode, setReviewMode] = useState('slide'); // 'slide' or 'overview'
  
  const analytics = getPerformanceAnalytics();
  const currentMistake = mistakes[currentMistakeIndex];
  const totalMistakes = mistakes.length;

  if (totalMistakes === 0) {
    return (
      <motion.div 
        className="card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{ 
          maxWidth: '600px', 
          margin: '0 auto',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <div style={{ padding: '40px' }}>
          <CheckCircle size={64} style={{ margin: '0 auto 20px', color: '#4CAF50' }} />
          <h2 style={{ marginBottom: '15px', color: 'white' }}>Perfect Performance!</h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '20px' }}>
            No mistakes to review. You're doing great!
          </p>
          <button 
            className="btn"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '12px 24px'
            }}
          >
            Continue Learning
          </button>
        </div>
      </motion.div>
    );
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const handleNext = () => {
    if (currentMistakeIndex < totalMistakes - 1) {
      setCurrentMistakeIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentMistakeIndex > 0) {
      setCurrentMistakeIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleMarkAsReviewed = () => {
    markMistakeAsReviewed(currentMistake.id);
  };

  const getAnswerLetter = (index) => {
    return ['A', 'B', 'C', 'D'][index - 1] || String.fromCharCode(64 + index);
  };

  if (reviewMode === 'overview') {
    return (
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '1000px', margin: '0 auto' }}
      >
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>
              <TrendingUp size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
              Performance Analysis
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setReviewMode('slide')}
              >
                Review Mistakes
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '20px', 
              borderRadius: '12px', 
              color: 'white',
              textAlign: 'center'
            }}>
              <Target size={32} style={{ marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 5px 0' }}>{analytics.accuracy.toFixed(1)}%</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Accuracy</p>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              padding: '20px', 
              borderRadius: '12px', 
              color: 'white',
              textAlign: 'center'
            }}>
              <XCircle size={32} style={{ marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 5px 0' }}>{totalMistakes}</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Mistakes</p>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', 
              padding: '20px', 
              borderRadius: '12px', 
              color: 'white',
              textAlign: 'center'
            }}>
              <CheckCircle size={32} style={{ marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 5px 0' }}>{analytics.correctAnswers}</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Correct</p>
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Mistake Details</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {mistakes.map((mistake, index) => (
                <motion.div
                  key={mistake.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'white',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    borderLeft: `4px solid ${mistake.reviewed ? '#4CAF50' : '#f5576c'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                        Question {mistake.questionIndex + 1}
                      </h4>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6c757d' }}>
                        {mistake.questionText.substring(0, 100)}...
                      </p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
                        <span style={{ color: '#f5576c' }}>
                          Your Answer: {getAnswerLetter(mistake.selectedAnswer)}
                        </span>
                        <span style={{ color: '#4CAF50' }}>
                          Correct: {getAnswerLetter(mistake.correctAnswer)}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {mistake.reviewed && (
                        <CheckCircle size={16} style={{ color: '#4CAF50' }} />
                      )}
                      <button
                        onClick={() => {
                          setCurrentMistakeIndex(index);
                          setReviewMode('slide');
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid #007bff',
                          color: '#007bff',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '800px', margin: '0 auto', minHeight: '600px' }}
    >
      <div style={{ padding: '30px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>
              <BookOpen size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
              Mistake Review
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
              Question {currentMistakeIndex + 1} of {totalMistakes} mistakes
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setReviewMode('overview')}
            >
              Overview
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          background: '#e9ecef', 
          height: '6px', 
          borderRadius: '3px', 
          marginBottom: '30px',
          overflow: 'hidden'
        }}>
          <motion.div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: '100%',
              borderRadius: '3px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentMistakeIndex + 1) / totalMistakes) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Mistake Content */}
        <AnimatePresence mode="wait" custom={0}>
          <motion.div
            key={currentMistakeIndex}
            custom={0}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 500 }}
            style={{ perspective: '1000px' }}
          >
            <div style={{ 
              background: '#f8f9fa', 
              padding: '25px', 
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#2c3e50',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Question {currentMistake.questionIndex + 1}
              </h3>
              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6',
                margin: '0',
                color: '#2c3e50'
              }}>
                {currentMistake.questionText}
              </p>
            </div>

            {/* Answer Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                background: '#fff5f5',
                border: '2px solid #fed7d7',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <XCircle size={32} style={{ color: '#f56565', marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 10px 0', color: '#f56565' }}>Your Answer</h4>
                <div style={{
                  background: '#f56565',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {getAnswerLetter(currentMistake.selectedAnswer)}
                </div>
              </div>

              <div style={{
                background: '#f0fff4',
                border: '2px solid #c6f6d5',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <CheckCircle size={32} style={{ color: '#48bb78', marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 10px 0', color: '#48bb78' }}>Correct Answer</h4>
                <div style={{
                  background: '#48bb78',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {getAnswerLetter(currentMistake.correctAnswer)}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '15px'
                }}
              >
                {showExplanation ? <EyeOff size={16} /> : <Eye size={16} />}
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </button>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: '#e8f4fd',
                      border: '1px solid #bee5eb',
                      borderRadius: '8px',
                      padding: '20px',
                      overflow: 'hidden'
                    }}
                  >
                    <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>Explanation:</h4>
                    <p style={{ margin: 0, lineHeight: '1.6', color: '#0c5460' }}>
                      {currentMistake.explanation || 'No explanation available for this question.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <button
                onClick={handleMarkAsReviewed}
                disabled={currentMistake.reviewed}
                style={{
                  background: currentMistake.reviewed 
                    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: currentMistake.reviewed ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: currentMistake.reviewed ? 0.8 : 1
                }}
              >
                <CheckCircle size={16} />
                {currentMistake.reviewed ? 'Reviewed' : 'Mark as Reviewed'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentMistakeIndex === 0}
            className="btn btn-secondary"
            style={{
              opacity: currentMistakeIndex === 0 ? 0.5 : 1,
              cursor: currentMistakeIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {mistakes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentMistakeIndex(index);
                  setShowExplanation(false);
                }}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentMistakeIndex 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#e9ecef',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentMistakeIndex === totalMistakes - 1}
            className="btn btn-primary"
            style={{
              opacity: currentMistakeIndex === totalMistakes - 1 ? 0.5 : 1,
              cursor: currentMistakeIndex === totalMistakes - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MistakeReview;