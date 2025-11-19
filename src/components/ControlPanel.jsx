import React, { useState } from 'react';
import { Settings, Clock, Type, Eye, Shuffle, Target, Zap, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ControlPanel = ({ settings, onSettingsChange, availableTopics }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSetting = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleTopic = (topic) => {
    const currentTopics = settings.selectedTopics;
    let newTopics;
    
    if (currentTopics.includes(topic)) {
      newTopics = currentTopics.filter(t => t !== topic);
    } else {
      newTopics = [...currentTopics, topic];
    }
    
    updateSetting('selectedTopics', newTopics);
  };

  const selectAllTopics = () => {
    updateSetting('selectedTopics', [...availableTopics]);
  };

  const clearAllTopics = () => {
    updateSetting('selectedTopics', []);
  };

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 style={{ color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <Settings size={20} />
          Quiz Settings
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ⌄
        </motion.div>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? 'auto' : 0, 
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ padding: '20px 0' }}>
          {/* Timer Setting */}
          <div className="slider" style={{ marginBottom: '20px' }}>
            <Clock size={18} color="#667eea" />
            <label style={{ minWidth: '120px', fontWeight: '600' }}>Timer (seconds):</label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={settings.timer}
              onChange={(e) => updateSetting('timer', parseInt(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ 
              background: '#667eea', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '16px',
              minWidth: '50px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {settings.timer}s
            </span>
          </div>

          {/* Font Size Setting */}
          <div className="slider" style={{ marginBottom: '20px' }}>
            <Type size={18} color="#667eea" />
            <label style={{ minWidth: '120px', fontWeight: '600' }}>Font Size (px):</label>
            <input
              type="range"
              min="12"
              max="24"
              step="2"
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ 
              background: '#667eea', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '16px',
              minWidth: '50px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {settings.fontSize}px
            </span>
          </div>

          {/* Toggle Settings */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Eye size={18} color="#667eea" />
              <span style={{ fontWeight: '600' }}>Show Solutions</span>
              <input
                type="checkbox"
                checked={settings.showSolutions}
                onChange={(e) => updateSetting('showSolutions', e.target.checked)}
                style={{ marginLeft: 'auto' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Shuffle size={18} color="#667eea" />
              <span style={{ fontWeight: '600' }}>Randomize Questions</span>
              <input
                type="checkbox"
                checked={settings.randomizeQuestions}
                onChange={(e) => updateSetting('randomizeQuestions', e.target.checked)}
                style={{ marginLeft: 'auto' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <Zap size={18} color="#667eea" />
              <span style={{ fontWeight: '600' }}>Auto Next Question</span>
              <input
                type="checkbox"
                checked={settings.autoNext}
                onChange={(e) => updateSetting('autoNext', e.target.checked)}
                style={{ marginLeft: 'auto' }}
              />
            </label>
          </div>

          {/* Topic Filter */}
          {availableTopics.length > 0 && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <h4 style={{ 
                  color: '#667eea', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  margin: 0
                }}>
                  <Filter size={18} />
                  Filter by Topics ({settings.selectedTopics.length}/{availableTopics.length})
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={selectAllTopics}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Select All
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={clearAllTopics}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="topic-filter">
                {availableTopics.map(topic => (
                  <button
                    key={topic}
                    className={`topic-tag ${settings.selectedTopics.includes(topic) ? 'active' : ''}`}
                    onClick={() => toggleTopic(topic)}
                  >
                    <Target size={12} />
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            padding: '15px',
            borderRadius: '12px',
            marginTop: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px',
            fontSize: '14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                {settings.selectedTopics.length > 0 
                  ? availableTopics.filter(topic => settings.selectedTopics.includes(topic)).length
                  : availableTopics.length}
              </div>
              <div style={{ color: '#6c757d' }}>Active Topics</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                {Math.floor(settings.timer / 60)}:{(settings.timer % 60).toString().padStart(2, '0')}
              </div>
              <div style={{ color: '#6c757d' }}>Time/Question</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                {settings.fontSize}px
              </div>
              <div style={{ color: '#6c757d' }}>Font Size</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ControlPanel;