import React, { useState, useEffect } from 'react';
import { Upload, Download, Play, Pause, RotateCcw, Eye, Settings, Clock, Trophy, Target, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUploader from './components/FileUploader';
import QuizInterface from './components/QuizInterface';
import ResultsViewer from './components/ResultsViewer';
import ControlPanel from './components/ControlPanel';
import ModeSelector from './components/ModeSelector';
import RecapQuiz from './components/RecapQuiz';
import { parseXLSXFile, downloadTemplate, exportQuizResults } from './utils/excelParser';
import useQuizStore from './store/quizStore';

function App() {
  const [currentMode, setCurrentMode] = useState('upload'); // upload, quiz, results
  const [quizSettings, setQuizSettings] = useState({
    timer: 60, // seconds per question
    fontSize: 16,
    showSolutions: true,
    randomizeQuestions: false,
    selectedTopics: [],
    autoNext: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableTopics, setAvailableTopics] = useState([]);

  const {
    questions,
    quizStarted,
    testCompleted,
    isRecapMode,
    setQuestions,
    resetQuiz,
    getScore,
    updateSettings
  } = useQuizStore();

  useEffect(() => {
    if (questions.length > 0) {
      const topics = [...new Set(questions.map(q => q.Topic))];
      setAvailableTopics(topics);
      setQuizSettings(prev => ({
        ...prev,
        selectedTopics: topics
      }));
    }
  }, [questions]);

  // Update store settings when quiz settings change
  useEffect(() => {
    updateSettings(quizSettings);
  }, [quizSettings, updateSettings]);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    try {
      const parsedQuestions = await parseXLSXFile(file);
      console.log('Parsed questions:', parsedQuestions); // Debug log
      setQuestions(parsedQuestions);
      setCurrentMode('quiz');
      console.log(`Loaded ${parsedQuestions.length} questions`);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file: ' + error.message);
    }
    setIsLoading(false);
  };

  const handleQuizComplete = () => {
    const score = getScore();
    console.log('Quiz completed with score:', score);
    setCurrentMode('results');
  };

  const getFilteredQuestions = () => {
    let filtered = questions;
    
    if (quizSettings.selectedTopics.length > 0) {
      filtered = filtered.filter(q => quizSettings.selectedTopics.includes(q.Topic));
    }
    
    if (quizSettings.randomizeQuestions) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    
    return filtered;
  };

  const handleResetQuiz = () => {
    resetQuiz();
    setCurrentMode('quiz');
  };

  const startNewQuiz = () => {
    resetQuiz();
    setQuestions([]);
    setCurrentMode('upload');
  };

  const exportResults = () => {
    const score = getScore();
    if (questions.length > 0) {
      exportQuizResults(score, questions);
    }
  };

  return (
    <div className="container">
      <motion.header 
        className="card"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Smart Quiz Learning
            </h1>
            <p style={{ color: '#6c757d', marginTop: '8px' }}>
              Upload XLSX files and create instant interactive quizzes
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {questions.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#6c757d' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={16} />
                  {questions.length} Questions
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={16} />
                  {availableTopics.length} Topics
                </span>
              </div>
            )}
            
            <button 
              className="btn btn-secondary"
              onClick={downloadTemplate}
              title="Download Excel Template"
            >
              <Download size={16} />
              Template
            </button>
            
            {currentMode !== 'upload' && (
              <button 
                className="btn btn-primary"
                onClick={startNewQuiz}
              >
                <Upload size={16} />
                New Quiz
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {currentMode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <FileUploader 
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {currentMode === 'quiz' && questions.length > 0 && !isRecapMode && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <ModeSelector />
            
            <ControlPanel
              settings={quizSettings}
              onSettingsChange={setQuizSettings}
              availableTopics={availableTopics}
            />
            
            <QuizInterface />
          </motion.div>
        )}

        {isRecapMode && (
          <motion.div
            key="recap"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <RecapQuiz />
          </motion.div>
        )}

        {currentMode === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Trophy size={24} />
                  Quiz Results
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={exportResults}
                  >
                    <Download size={16} />
                    Export Results
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleResetQuiz}
                  >
                    <RotateCcw size={16} />
                    Retake Quiz
                  </button>
                </div>
              </div>
            </div>
            
            <ResultsViewer
              questions={getFilteredQuestions()}
              settings={quizSettings}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div 
          className="card loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner"></div>
          <p style={{ marginLeft: '15px', color: '#667eea' }}>Processing your quiz file...</p>
        </motion.div>
      )}
    </div>
  );
}

export default App;