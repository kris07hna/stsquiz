import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Clock, BookOpen, Eye, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useQuizStore from '../store/quizStore';

const RecapQuiz = () => {
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const {
    recapQuestions,
    currentQuestionIndex,
    answers,
    fontSize,
    showFeedback,
    exitRecapQuiz,
    setCurrentQuestion,
    setAnswer,
    nextQuestion,
    previousQuestion,
    setShowFeedback
  } = useQuizStore();

  const currentRecap = recapQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  if (!currentRecap || recapQuestions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No wrong answers to review</h3>
        <p>Great job! You don't have any mistakes to review.</p>
        <button className="btn btn-primary" onClick={exitRecapQuiz}>
          <ArrowLeft size={16} />
          Back to Quiz
        </button>
      </div>
    );
  }

  const handleAnswerSelect = (choiceKey) => {
    if (answered) return; // Prevent multiple selections
    
    setAnswer(currentQuestionIndex, choiceKey);
    setAnswered(true);
    setShowFeedback(true);
    
    // Automatically show explanation after a brief moment
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < recapQuestions.length - 1) {
        nextQuestion();
      }
      resetQuestionState();
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestionIndex > 0) {
        previousQuestion();
      }
      resetQuestionState();
      setIsTransitioning(false);
    }, 300);
  };
  
  const resetQuestionState = () => {
    setAnswered(false);
    setShowExplanation(false);
    setShowFeedback(false);
  };
  
  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const normalizeAnswer = (ans) => {
    if (!ans) return '';
    const str = ans.toString().trim().toUpperCase();
    if (/^[1-4]$/.test(str)) {
      return String.fromCharCode(64 + parseInt(str));
    }
    return str;
  };

  const correctAnswer = normalizeAnswer(currentRecap.correctAnswer);
  const progress = ((currentQuestionIndex + 1) / recapQuestions.length) * 100;

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px 12px 0 0',
        margin: '-20px -20px 20px -20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RotateCcw size={24} />
              Recap Quiz - Review Your Mistakes
            </h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
              Question {currentQuestionIndex + 1} of {recapQuestions.length}
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={exitRecapQuiz}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}
          >
            <ArrowLeft size={16} />
            Exit Recap
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          height: '8px',
          marginTop: '15px',
          overflow: 'hidden'
        }}>
          <motion.div
            style={{
              background: 'rgba(255,255,255,0.8)',
              height: '100%',
              borderRadius: '10px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Info */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #fee2e2'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
            <Target size={16} style={{ display: 'inline', marginRight: '5px' }} />
            Original Mistake
          </span>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            Topic: {currentRecap.topic}
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
          <div>
            <span style={{ color: '#dc2626', fontWeight: '600' }}>Your Previous Answer:</span>
            <div style={{ color: '#991b1b', marginTop: '5px' }}>
              {currentRecap.selectedAnswer} - {currentRecap.selectedAnswerText}
            </div>
          </div>
          <div>
            <span style={{ color: '#059669', fontWeight: '600' }}>Correct Answer:</span>
            <div style={{ color: '#047857', marginTop: '5px' }}>
              {currentRecap.correctAnswer} - {currentRecap.correctAnswerText}
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ 
          fontSize: `${fontSize + 2}px`,
          lineHeight: '1.6', 
          color: '#2c3e50',
          marginBottom: '20px'
        }}>
          {currentRecap.question}
        </h3>

        {/* Choices */}
        <div style={{ marginBottom: '25px' }}>
          {[
            { key: 'A', text: currentRecap.choice_1 || '' },
            { key: 'B', text: currentRecap.choice_2 || '' },
            { key: 'C', text: currentRecap.choice_3 || '' },
            { key: 'D', text: currentRecap.choice_4 || '' }
          ].filter(choice => choice.text.trim() !== '').map((choice, index) => {
            let choiceClass = 'choice';
            
            if (selectedAnswer === choice.key) {
              choiceClass += ' selected';
            }
            
            if (showFeedback) {
              if (choice.key === correctAnswer) {
                choiceClass = 'choice correct';
              } else if (selectedAnswer === choice.key && choice.key !== correctAnswer) {
                choiceClass = 'choice incorrect';
              } else if (choice.key === currentRecap.selectedAnswer) {
                // Mark the originally wrong answer
                choiceClass += ' originally-wrong';
              }
            }
            
            return (
              <motion.div
                key={choice.key}
                className={choiceClass}
                onClick={() => !answered && handleAnswerSelect(choice.key)}
                whileHover={{ scale: !answered ? 1.02 : 1 }}
                whileTap={{ scale: !answered ? 0.98 : 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  cursor: !answered ? 'pointer' : 'default',
                  opacity: answered && choice.key !== selectedAnswer && choice.key !== correctAnswer ? 0.6 : 1,
                  border: choice.key === currentRecap.selectedAnswer && showFeedback 
                    ? '2px dashed #ef4444' 
                    : undefined
                }}
              >
                <span style={{ 
                  fontWeight: 'bold', 
                  marginRight: '12px',
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px'
                }}>
                  {choice.key}
                </span>
                {choice.text}
                
                {/* Icons */}
                {showFeedback && choice.key === correctAnswer && (
                  <CheckCircle size={20} style={{ marginLeft: 'auto', color: '#22c55e' }} />
                )}
                {showFeedback && selectedAnswer === choice.key && choice.key !== correctAnswer && (
                  <XCircle size={20} style={{ marginLeft: 'auto', color: '#ef4444' }} />
                )}
                {showFeedback && choice.key === currentRecap.selectedAnswer && choice.key !== selectedAnswer && (
                  <span style={{ 
                    marginLeft: 'auto',
                    fontSize: '12px',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    (Previously selected)
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedAnswer === correctAnswer ? (
                <div style={{ 
                  background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                  border: '1px solid #22c55e',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <CheckCircle size={20} style={{ color: '#22c55e' }} />
                    <span style={{ fontWeight: 'bold', color: '#166534' }}>
                      Excellent! You got it right this time!
                    </span>
                  </div>
                  <p style={{ color: '#166534', margin: 0 }}>
                    You've learned from your mistake. Keep it up!
                  </p>
                </div>
              ) : (
                <div style={{ 
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <XCircle size={20} style={{ color: '#ef4444' }} />
                    <span style={{ fontWeight: 'bold', color: '#991b1b' }}>
                      Still incorrect. Let's review the explanation.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation Control */}
        {answered && !showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '20px' }}
          >
            <button
              onClick={handleShowExplanation}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <Eye size={16} />
              Show Detailed Explanation
            </button>
          </motion.div>
        )}

        {/* Solution */}
        <AnimatePresence>
          {showExplanation && currentRecap.solution && (
            <motion.div
              className="solution-viewer"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '2px solid #0ea5e9',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)'
              }}
            >
              <h4 style={{ 
                color: '#0369a1', 
                marginBottom: '15px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                <BookOpen size={22} />
                Detailed Explanation:
              </h4>
              <p style={{ 
                lineHeight: '1.8', 
                color: '#0c4a6e', 
                margin: 0,
                fontSize: '16px',
                background: 'rgba(255,255,255,0.7)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid rgba(14, 165, 233, 0.2)'
              }}>
                {currentRecap.solution}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="controls" style={{ marginTop: '30px' }}>
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isTransitioning}
          style={{ opacity: isTransitioning ? 0.6 : 1 }}
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          flex: 1,
          justifyContent: 'center'
        }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            {currentQuestionIndex + 1} / {recapQuestions.length}
          </span>
          
          {/* Progress indicators */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {recapQuestions.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentQuestionIndex 
                    ? '#0ea5e9' 
                    : index < currentQuestionIndex 
                      ? '#22c55e'
                      : '#e5e7eb',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
        
        {answered ? (
          currentQuestionIndex < recapQuestions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={isTransitioning}
              style={{ opacity: isTransitioning ? 0.6 : 1 }}
            >
              Next Mistake
              <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          ) : (
            <button className="btn btn-success" onClick={exitRecapQuiz}>
              <CheckCircle size={16} />
              Complete Recap
            </button>
          )
        ) : (
          <div style={{ 
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            border: '2px dashed #9ca3af',
            borderRadius: '8px',
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Select an answer first
          </div>
        )}
      </div>

      {/* Additional Styles */}
      <style jsx>{`
        .originally-wrong {
          border: 2px dashed #ef4444 !important;
          background: rgba(239, 68, 68, 0.05) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default RecapQuiz;