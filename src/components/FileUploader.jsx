import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUploader = ({ onFileUpload, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    setError('');
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e) => {
    setError('');
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }
    
    onFileUpload(file);
  };

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ 
        color: '#667eea', 
        marginBottom: '30px', 
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <FileSpreadsheet size={28} />
        Upload Your Quiz File
      </h2>
      
      <div
        className={`upload-area ${isDragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <Upload size={48} color="#667eea" style={{ marginBottom: '20px' }} />
        <h3 style={{ color: '#667eea', marginBottom: '10px' }}>
          Drop your Excel file here or click to browse
        </h3>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          Supports .xlsx and .xls files up to 10MB
        </p>
        <div className="btn btn-primary">
          <Upload size={16} />
          Choose File
        </div>
        
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>
      
      {error && (
        <motion.div 
          style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '15px', 
            borderRadius: '8px', 
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle size={20} />
          {error}
        </motion.div>
      )}
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
        <h4 style={{ color: '#667eea', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={20} />
          Expected File Format:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '12px' }}>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>Question_ID</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>Question_Text</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>choice_1</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>choice_2</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>choice_3</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>choice_4</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>answer_key</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>Solution</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>Topic</div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: '600' }}>Marks</div>
        </div>
        <p style={{ color: '#6c757d', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
          Download the template above to see the exact format required
        </p>
      </div>
    </motion.div>
  );
};

export default FileUploader;