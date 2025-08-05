import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quizAPI, userAPI } from '../services/api';
import './SkillTest.css';

// Map user skills to quiz categories
const skillToCategoryMap = {
  javascript: 'PROGRAMMING',
  reactjs: 'PROGRAMMING',
  python: 'PROGRAMMING',
  webdevelopment: 'TECHNICAL',
  appdevelopment: 'TECHNICAL',
  java: 'PROGRAMMING',
  cpp: 'PROGRAMMING',
  csharp: 'PROGRAMMING',
  php: 'PROGRAMMING',
  ruby: 'PROGRAMMING',
  swift: 'PROGRAMMING',
  kotlin: 'PROGRAMMING',
  html: 'TECHNICAL',
  css: 'TECHNICAL',
  sql: 'TECHNICAL',
  mongodb: 'TECHNICAL',
  nodejs: 'PROGRAMMING',
  angular: 'PROGRAMMING',
  vue: 'PROGRAMMING',
  django: 'PROGRAMMING',
  flask: 'PROGRAMMING',
  laravel: 'PROGRAMMING',
  spring: 'PROGRAMMING',
  dotnet: 'PROGRAMMING',
  android: 'TECHNICAL',
  ios: 'TECHNICAL',
  flutter: 'TECHNICAL',
  reactnative: 'TECHNICAL',
  xamarin: 'TECHNICAL',
  aws: 'TECHNICAL',
  azure: 'TECHNICAL',
  gcp: 'TECHNICAL',
  docker: 'TECHNICAL',
  kubernetes: 'TECHNICAL',
  git: 'TECHNICAL',
  linux: 'TECHNICAL',
  networking: 'TECHNICAL',
  cybersecurity: 'TECHNICAL',
  machinelearning: 'DATA_SCIENCE',
  ai: 'DATA_SCIENCE',
  datascience: 'DATA_SCIENCE',
  statistics: 'DATA_SCIENCE',
  excel: 'BUSINESS',
  powerpoint: 'BUSINESS',
  word: 'BUSINESS',
  photoshop: 'DESIGN',
  illustrator: 'DESIGN',
  figma: 'DESIGN',
  sketch: 'DESIGN',
  canva: 'DESIGN',
  marketing: 'DIGITAL_MARKETING',
  seo: 'DIGITAL_MARKETING',
  socialmedia: 'DIGITAL_MARKETING',
  contentwriting: 'DIGITAL_MARKETING',
  emailmarketing: 'DIGITAL_MARKETING',
  leadership: 'SOFT_SKILLS',
  communication: 'SOFT_SKILLS',
  teamwork: 'SOFT_SKILLS',
  problemsolving: 'SOFT_SKILLS',
  timemanagement: 'SOFT_SKILLS',
  negotiation: 'SOFT_SKILLS',
  publicspeaking: 'SOFT_SKILLS',
  projectmanagement: 'BUSINESS',
  entrepreneurship: 'BUSINESS',
  finance: 'BUSINESS',
  accounting: 'BUSINESS',
  sales: 'BUSINESS',
  customer_service: 'SOFT_SKILLS',
  resume: 'CAREER_GUIDANCE',
  interview: 'CAREER_GUIDANCE',
  networking: 'CAREER_GUIDANCE',
  career_planning: 'CAREER_GUIDANCE'
};

function getCategoryFromSkills(skills) {
  if (!skills || skills.length === 0) return 'GENERAL_KNOWLEDGE';
  
  const userSkills = skills.toLowerCase();
  const skillWords = userSkills.split(/[,\s]+/);
  
  for (const skill of skillWords) {
    if (skillToCategoryMap[skill]) {
      return skillToCategoryMap[skill];
    }
  }
  
  // Default categories based on common skill patterns
  if (userSkills.includes('programming') || userSkills.includes('coding') || userSkills.includes('developer')) {
    return 'PROGRAMMING';
  }
  if (userSkills.includes('design') || userSkills.includes('creative')) {
    return 'DESIGN';
  }
  if (userSkills.includes('marketing') || userSkills.includes('advertising')) {
    return 'DIGITAL_MARKETING';
  }
  if (userSkills.includes('business') || userSkills.includes('management')) {
    return 'BUSINESS';
  }
  if (userSkills.includes('data') || userSkills.includes('analytics')) {
    return 'DATA_SCIENCE';
  }
  
  return 'GENERAL_KNOWLEDGE';
}

const SkillTest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [skills, setSkills] = useState(location.state?.skills || '');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizId, setQuizId] = useState(null);

  useEffect(() => {
    if (!skills) {
      // Try to get skills from user profile if not passed in navigation
      fetchUserSkills();
      return;
    }
    
    generateQuizFromSkills();
  }, [skills, navigate]);

  const fetchUserSkills = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getCurrentUserProfile();
      const userProfile = response.data;
      
      if (userProfile && userProfile.length > 0) {
        const profile = userProfile[0];
        const userSkills = profile.skill_set || '';
        
        if (userSkills) {
          // Update the skills state and generate quiz
          setSkills(userSkills);
          generateQuizFromSkills(userSkills);
        } else {
          setError('No skills found in your profile. Please complete your profile first.');
          setIsLoading(false);
        }
      } else {
        setError('Unable to load your profile. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
      setError('Failed to load your profile. Please try again.');
      setIsLoading(false);
    }
  };

  const generateQuizFromSkills = async (userSkills = skills) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const category = getCategoryFromSkills(userSkills);
      const topic = userSkills; // Use skills as the topic for more specific questions
      
      const response = await quizAPI.generateQuiz({
        topic: topic,
        category: category,
        difficulty: 'MEDIUM',
        num_questions: 10,
        time_limit: 5, // 5 minutes
        passing_score: 70
      });
      
      const quizData = response.data.quiz;
      setQuizId(quizData.id);
      
      // Transform AI-generated questions to match the component's expected format
      const transformedQuestions = quizData.questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: [q.options.A, q.options.B, q.options.C, q.options.D],
        correct_answer: ['A', 'B', 'C', 'D'].indexOf(q.correct_answer),
        explanation: q.explanation,
        key: index + 1
      }));
      
      setQuestions(transformedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      submitTest();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const submitTest = async () => {
    try {
      if (!quizId) {
        alert('Quiz not found. Please try again.');
        return;
      }

      // Transform answers to match API format (question index as key, answer letter as value)
      const apiAnswers = {};
      Object.keys(answers).forEach(questionId => {
        const questionIndex = parseInt(questionId) - 1; // Convert to 0-based index
        const answerIndex = answers[questionId];
        const answerLetter = ['A', 'B', 'C', 'D'][answerIndex];
        apiAnswers[questionIndex] = answerLetter;
      });

      const response = await quizAPI.submitQuiz(quizId, apiAnswers);
      const result = response.data;
      
      // Show results
      const message = `Quiz completed!\n\nScore: ${result.score}%\nCorrect Answers: ${result.correct_answers}/${result.total_questions}\nStatus: ${result.passed ? 'PASSED' : 'FAILED'}`;
      alert(message);
      
      // Navigate to results page or dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleAnswerSelect = (qId, optionIndex) => {
    setAnswers({ ...answers, [qId]: optionIndex });
  };

  if (isLoading) return (
    <div className="skilltest-bg">
      <div className="skilltest-centre-box">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Generating AI Quiz...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Creating personalized questions based on your skills</div>
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #3498db', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="skilltest-bg">
      <div className="skilltest-centre-box">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px', color: '#e74c3c' }}>Error</div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>{error}</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                setError(null);
                if (skills) {
                  generateQuizFromSkills();
                } else {
                  fetchUserSkills();
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button 
              onClick={() => navigate('/onboarding')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!questions.length) return (
    <div className="skilltest-bg">
      <div className="skilltest-centre-box">No questions available.</div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="skilltest-bg">
      <div className="skilltest-centre-box">
        <header className="skilltest-header">
          <span>Skill Test</span>
          <span className="skilltest-timer">
            Time Left: {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </header>
        <div className="skilltest-question-count">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="skilltest-question-text">{currentQuestion.question}</div>
        <ul className="skilltest-options">
          {currentQuestion.options.map((opt, i) => (
            <li
              key={i}
              className={answers[currentQuestion.id] === i ? 'selected' : ''}
              onClick={() => handleAnswerSelect(currentQuestion.id, i)}
            >
              {opt}
            </li>
          ))}
        </ul>
        <div className="skilltest-controls">
          <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}>Previous</button>
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              disabled={answers[currentQuestion.id] === undefined}>
              Next
            </button>
          ) : (
            <button
              onClick={submitTest}
              disabled={answers[currentQuestion.id] === undefined}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTest;