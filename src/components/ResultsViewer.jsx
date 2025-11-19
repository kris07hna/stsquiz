import React, { useState, useMemo } from 'react';
import { Trophy, Target, Clock, Award, TrendingUp, Flag, CheckCircle, XCircle, Eye, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsViewer = ({ results, questions, settings }) => {
  const [selectedView, setSelectedView] = useState('overview'); // overview, detailed, analytics
  const [selectedTopic, setSelectedTopic] = useState('all');

  const stats = useMemo(() => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const maxMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const totalTime = results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
    const avgTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0;
    const flaggedCount = results.filter(r => r.isFlagged).length;

    // Topic-wise analysis
    const topicStats = {};
    questions.forEach((question, index) => {
      const result = results[index];
      if (!topicStats[question.topic]) {
        topicStats[question.topic] = {
          total: 0,
          correct: 0,
          marks: 0,
          maxMarks: 0,
          timeSpent: 0
        };
      }
      
      topicStats[question.topic].total += 1;
      if (result.isCorrect) topicStats[question.topic].correct += 1;
      topicStats[question.topic].marks += result.marks;
      topicStats[question.topic].maxMarks += question.marks;
      topicStats[question.topic].timeSpent += result.timeSpent || 0;
    });

    // Grade calculation
    const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    return {
      totalQuestions,
      correctAnswers,
      totalMarks,
      maxMarks,
      accuracy,
      totalTime,
      avgTimePerQuestion,
      flaggedCount,
      topicStats,
      grade,
      percentage
    };
  }, [results, questions]);

  const getFilteredResults = () => {
    if (selectedTopic === 'all') {
      return results.map((result, index) => ({ ...result, question: questions[index], index }));
    }
    
    return results
      .map((result, index) => ({ ...result, question: questions[index], index }))
      .filter(item => item.question.topic === selectedTopic);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#f44336';
  };

  return (
    <div>
      {/* Navigation */}
      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${selectedView === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedView('overview')}
          >
            <BarChart3 size={16} />
            Overview
          </button>
          <button
            className={`btn ${selectedView === 'detailed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedView('detailed')}
          >
            <Eye size={16} />
            Detailed Review
          </button>
          <button
            className={`btn ${selectedView === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedView('analytics')}
          >
            <PieChart size={16} />
            Analytics
          </button>
        </div>

        {/* Topic Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '600', color: '#667eea' }}>Filter by Topic:</span>
          <button
            className={`topic-tag ${selectedTopic === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTopic('all')}
          >
            All Topics
          </button>
          {Object.keys(stats.topicStats).map(topic => (
            <button
              key={topic}
              className={`topic-tag ${selectedTopic === topic ? 'active' : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {selectedView === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number" style={{ color: getPerformanceColor(stats.percentage) }}>
                {stats.grade}
              </div>
              <div className="stat-label">Final Grade</div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
                {stats.percentage.toFixed(1)}%
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{stats.correctAnswers}/{stats.totalQuestions}</div>
              <div className="stat-label">Questions Correct</div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
                {stats.accuracy.toFixed(1)}% Accuracy
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{stats.totalMarks}</div>
              <div className="stat-label">Marks Scored</div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
                out of {stats.maxMarks}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{formatTime(stats.avgTimePerQuestion)}</div>
              <div className="stat-label">Avg Time/Question</div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
                Total: {formatTime(stats.totalTime)}
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '20px' }}>Performance Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Strengths</h4>
                <ul style={{ color: '#28a745', lineHeight: '1.8' }}>
                  {stats.accuracy >= 80 && <li>Excellent accuracy rate ({stats.accuracy.toFixed(1)}%)</li>}
                  {stats.avgTimePerQuestion <= settings.timer * 0.7 && <li>Good time management</li>}
                  {Object.entries(stats.topicStats).filter(([_, data]) => (data.correct / data.total) >= 0.8).map(([topic]) => (
                    <li key={topic}>Strong performance in {topic}</li>
                  ))}
                  {stats.flaggedCount === 0 && <li>Confident responses (no flagged questions)</li>}
                </ul>
              </div>
              
              <div>
                <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Areas for Improvement</h4>
                <ul style={{ color: '#dc3545', lineHeight: '1.8' }}>
                  {stats.accuracy < 60 && <li>Focus on accuracy ({stats.accuracy.toFixed(1)}% correct)</li>}
                  {stats.avgTimePerQuestion > settings.timer * 0.9 && <li>Work on time management</li>}
                  {Object.entries(stats.topicStats).filter(([_, data]) => (data.correct / data.total) < 0.6).map(([topic]) => (
                    <li key={topic}>Review {topic} concepts</li>
                  ))}
                  {stats.flaggedCount > stats.totalQuestions * 0.3 && <li>Build confidence in answers</li>}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Review */}
      {selectedView === 'detailed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {getFilteredResults().map((item, idx) => (
            <motion.div
              key={item.index}
              className="question-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ color: '#2c3e50', margin: 0 }}>
                    Question {item.index + 1}
                    {item.isFlagged && <Flag size={16} color="#f44336" style={{ marginLeft: '8px' }} />}
                  </h4>
                  <p style={{ color: '#6c757d', margin: '5px 0 0 0' }}>
                    {item.question.topic} • {item.question.marks} marks • {formatTime(item.timeSpent)} taken
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.isCorrect ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#28a745' }}>
                      <CheckCircle size={20} />
                      <span style={{ fontWeight: 'bold' }}>Correct</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#dc3545' }}>
                      <XCircle size={20} />
                      <span style={{ fontWeight: 'bold' }}>Incorrect</span>
                    </div>
                  )}
                </div>
              </div>

              <p style={{ marginBottom: '15px', lineHeight: '1.6', fontSize: '16px' }}>
                {item.question.text}
              </p>

              <div style={{ marginBottom: '15px' }}>
                {item.question.choices.map((choice, choiceIndex) => (
                  <div
                    key={choiceIndex}
                    className={`choice ${
                      choiceIndex === item.question.correctAnswer ? 'correct' :
                      item.selectedAnswer === choiceIndex ? 'incorrect' : ''
                    }`}
                    style={{ cursor: 'default' }}
                  >
                    <span style={{ fontWeight: 'bold', marginRight: '12px' }}>
                      {String.fromCharCode(65 + choiceIndex)}
                    </span>
                    {choice}
                    {choiceIndex === item.question.correctAnswer && (
                      <CheckCircle size={20} style={{ marginLeft: 'auto' }} />
                    )}
                    {item.selectedAnswer === choiceIndex && choiceIndex !== item.question.correctAnswer && (
                      <XCircle size={20} style={{ marginLeft: 'auto' }} />
                    )}
                  </div>
                ))}
              </div>

              {item.question.solution && (
                <div className="solution-viewer">
                  <h5 style={{ color: '#28a745', marginBottom: '8px' }}>Explanation:</h5>
                  <p style={{ lineHeight: '1.6', margin: 0 }}>{item.question.solution}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Analytics */}
      {selectedView === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '20px' }}>Topic-wise Analysis</h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {Object.entries(stats.topicStats).map(([topic, data]) => {
                const accuracy = (data.correct / data.total) * 100;
                const scorePercentage = (data.marks / data.maxMarks) * 100;
                
                return (
                  <div
                    key={topic}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '2px solid #e9ecef'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ color: '#2c3e50', margin: 0 }}>{topic}</h4>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                        <span style={{ color: '#6c757d' }}>
                          {data.correct}/{data.total} correct
                        </span>
                        <span style={{ color: '#6c757d' }}>
                          {data.marks}/{data.maxMarks} marks
                        </span>
                        <span style={{ color: '#6c757d' }}>
                          {formatTime(data.timeSpent)} spent
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Accuracy</span>
                        <span style={{ fontSize: '14px', color: getPerformanceColor(accuracy) }}>
                          {accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="progress-bar" style={{ height: '6px' }}>
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${accuracy}%`,
                            background: `linear-gradient(90deg, ${getPerformanceColor(accuracy)} 0%, ${getPerformanceColor(accuracy)} 100%)`
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Score</span>
                        <span style={{ fontSize: '14px', color: getPerformanceColor(scorePercentage) }}>
                          {scorePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="progress-bar" style={{ height: '6px' }}>
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${scorePercentage}%`,
                            background: `linear-gradient(90deg, ${getPerformanceColor(scorePercentage)} 0%, ${getPerformanceColor(scorePercentage)} 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '20px' }}>Time Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="stat-card">
                <div className="stat-number">{formatTime(stats.totalTime)}</div>
                <div className="stat-label">Total Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{formatTime(stats.avgTimePerQuestion)}</div>
                <div className="stat-label">Average per Question</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{formatTime(settings.timer)}</div>
                <div className="stat-label">Allowed per Question</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ 
                  color: stats.avgTimePerQuestion <= settings.timer * 0.8 ? '#28a745' : '#dc3545' 
                }}>
                  {((stats.avgTimePerQuestion / settings.timer) * 100).toFixed(0)}%
                </div>
                <div className="stat-label">Time Efficiency</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultsViewer;