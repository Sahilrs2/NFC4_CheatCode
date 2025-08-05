import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SkillTest.css';

const questionDB = {
  javascript: [
    { id: 1, question: 'What is a closure in JavaScript?', options: ['A function bundled with lexical scope', 'A variable', 'An object', 'A DOM element'], answer: 0 },
    { id: 2, question: 'Which method converts JSON to an object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.object()', 'JSON.convert()'], answer: 0 },
  ],
  reactjs: [
    { id: 3, question: 'Which hook is used for state management?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], answer: 0 },
    { id: 4, question: 'JSX stands for?', options: ['JavaScript XML', 'JavaScript and XHTML', 'Java Syntax Extension', 'JavaScript Extension'], answer: 0 },
  ],
  python: [
    { id: 5, question: 'What is the output of print(2**3)?', options: ['6', '8', '9', '5'], answer: 1 },
    { id: 6, question: 'Which keyword defines a function in Python?', options: ['func', 'function', 'def', 'fun'], answer: 2 },
  ],
  webdevelopment: [
    { id: 7, question: 'HTML stands for?', options: ['HyperText Markup Language', 'Hyperlinks Text Mark Language', 'Home Tool Markup Language', 'Hyperlinking Text Marking Language'], answer: 0 },
    { id: 8, question: 'CSS is used for?', options: ['Content', 'Styling', 'Programming', 'Structuring'], answer: 1 },
  ],
  appdevelopment: [
    { id: 9, question: 'Android apps are primarily built with?', options: ['Java/Kotlin', 'Swift', 'Python', 'Ruby'], answer: 0 },
    { id: 10, question: 'React Native is used for?', options: ['Web apps', 'Mobile apps', 'Desktop apps', 'Games'], answer: 1 },
  ]
};

function getQuestionsFromSkills(skills) {
  const skillKeys = Object.keys(questionDB);
  if (!skills || skills.length === 0) return [];

  const userSkills = skills.toLowerCase();
  let collected = [];
  skillKeys.forEach(skill => {
    if (userSkills.includes(skill)) {
      collected = collected.concat(questionDB[skill]);
    }
  });
  while (collected.length < 20) {
    skillKeys.forEach(skill => {
      if (collected.length < 20) {
        collected = collected.concat(questionDB[skill].slice(0, 1));
      }
    });
  }
  // Add question index suffix for key uniqueness
  return collected.slice(0, 20).map((q, i) => ({ ...q, key: i + 1 }));
}

const SkillTest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const skills = location.state?.skills || '';
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins

  useEffect(() => {
    if (!skills) {
      alert("No skills data found. Redirecting to onboarding.");
      navigate('/onboarding');
      return;
    }
    const qs = getQuestionsFromSkills(skills);
    setQuestions(qs);
  }, [skills, navigate]);

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

  const submitTest = () => {
    alert('Time is up or test submitted! Thank you.');
    navigate('/'); // Change to results page if you wish
  };

  const handleAnswerSelect = (qId, optionIndex) => {
    setAnswers({ ...answers, [qId]: optionIndex });
  };

  if (!questions.length) return (
    <div className="skilltest-bg">
      <div className="skilltest-centre-box">Loading questions...</div>
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