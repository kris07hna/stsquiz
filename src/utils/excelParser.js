import * as XLSX from 'xlsx';

export const parseXLSXFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Process the data according to your format
        const questions = processQuizData(jsonData);
        
        resolve(questions);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

const processQuizData = (data) => {
  if (data.length < 2) {
    throw new Error('Invalid file format. File should contain headers and data.');
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  // Map headers to indices (flexible header mapping)
  const headerMap = {};
  headers.forEach((header, index) => {
    const cleanHeader = header?.toString().trim();
    headerMap[cleanHeader] = index;
  });
  
  const questions = rows.map((row, index) => {
    if (!row || row.length === 0) return null;
    
    const question = {
      Question_ID: row[headerMap['Question_ID']] || `q_${index + 1}`,
      Question_Text: row[headerMap['Question_Text']] || '',
      choice_1: row[headerMap['choice_1']] || '',
      choice_2: row[headerMap['choice_2']] || '',
      choice_3: row[headerMap['choice_3']] || '',
      choice_4: row[headerMap['choice_4']] || '',
      answer_key: row[headerMap['answer_key']] || 'A',
      Solution: row[headerMap['Solution']] || '',
      Topic: row[headerMap['Topic']] || 'General',
      Marks: parseInt(row[headerMap['Marks']]) || 1
    };
    
    // Validate question
    if (!question.Question_Text || (!question.choice_1 && !question.choice_2)) {
      return null;
    }
    
    return question;
  }).filter(q => q !== null);
  
  return questions;
};

export const downloadTemplate = () => {
  const templateData = [
    ['Question_ID', 'Question_Text', 'choice_1', 'choice_2', 'choice_3', 'choice_4', 'answer_key', 'Solution', 'Topic', 'Marks'],
    ['Q001', 'What is the capital of France?', 'London', 'Paris', 'Berlin', 'Madrid', 'B', 'Paris is the capital and largest city of France.', 'Geography', 1],
    ['Q002', 'Which programming language is known for web development?', 'Python', 'JavaScript', 'C++', 'Java', 'B', 'JavaScript is primarily used for web development.', 'Programming', 1],
    ['Q003', 'What is 2 + 2?', '3', '4', '5', '6', 'B', 'Basic arithmetic: 2 + 2 = 4', 'Mathematics', 1]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz Template');
  
  XLSX.writeFile(wb, 'quiz_template.xlsx');
};

export const exportQuizResults = (results, questions) => {
  const exportData = [
    ['Question_ID', 'Question', 'Your_Answer', 'Correct_Answer', 'Is_Correct', 'Topic', 'Marks', 'Time_Taken']
  ];
  
  results.forEach((result, index) => {
    const question = questions[index];
    exportData.push([
      question.id,
      question.text,
      result.selectedAnswer !== null ? question.choices[result.selectedAnswer] : 'Not Answered',
      question.choices[question.correctAnswer],
      result.isCorrect ? 'Yes' : 'No',
      question.topic,
      result.isCorrect ? question.marks : 0,
      result.timeSpent || 0
    ]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz Results');
  
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `quiz_results_${date}.xlsx`);
};