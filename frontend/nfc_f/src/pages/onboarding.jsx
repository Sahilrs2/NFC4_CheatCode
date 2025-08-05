import React, { useState } from 'react';
import './Onboarding.css';

const disadvantageOptions = [
  "Economically Weaker",
  "Rural Area",
  "Educationally Barriers",
  "Physical disability",
  "Digital illiteracy",
  "Mobility issues",
  "Language barrier"
];

const Onboarding = () => {
  const [education, setEducation] = useState('');
  const [selectedDisadvantages, setSelectedDisadvantages] = useState([]);
  const [languagePref, setLanguagePref] = useState('');
  const [skills, setSkills] = useState('');

  const handleCheckboxChange = (value) => {
    if (selectedDisadvantages.includes(value)) {
      setSelectedDisadvantages(selectedDisadvantages.filter(item => item !== value));
    } else {
      setSelectedDisadvantages([...selectedDisadvantages, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Onboarding info submitted!');
  };

  return (
    <div className="onboarding-bg">
      <div className="onboarding-container">
        <h1 className="onboarding-header">Onboarding</h1>
        <form className="onboarding-form" onSubmit={handleSubmit}>
          {/* Education */}
          <div className="form-group">
            <label htmlFor="education">Education</label>
            <input
              type="text"
              id="education"
              value={education}
              onChange={e => setEducation(e.target.value)}
              placeholder="Eg: 10th Pass, Graduate..."
            />
          </div>

          {/* Disadvantages */}
          <div className="form-group">
            <label>Disadvantages (select all that apply)</label>
            <div className="checkbox-grid">
              {disadvantageOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedDisadvantages.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Language Preferences */}
          <div className="form-group">
            <label htmlFor="languagePref">Language Preferences</label>
            <input
              type="text"
              id="languagePref"
              value={languagePref}
              onChange={e => setLanguagePref(e.target.value)}
              placeholder="Eg: Hindi, Kannada, English..."
            />
          </div>

          {/* Skills - Textarea */}
          <div className="form-group">
            <label htmlFor="skills">Skills (please list your relevant skills)</label>
            <textarea
              id="skills"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              rows="5"
              placeholder="Eg: Digital literacy, communication, cooking, driving..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Goal (Short term goals to be achieved)</label>
            <textarea
              id="skills"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              rows="5"
              placeholder="Eg: Java, App development, ReactJs, Web development, Python, etc."
            />
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;