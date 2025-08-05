import React, { useState } from 'react';

const disadvantageOptions = [
  "Economically Weaker",
  "Rural Area",
  "Educational Barriers",
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
  const [goals, setGoals] = useState('');

  const handleCheckboxChange = (value) => {
    if (selectedDisadvantages.includes(value)) {
      setSelectedDisadvantages(selectedDisadvantages.filter(item => item !== value));
    } else {
      setSelectedDisadvantages([...selectedDisadvantages, value]);
    }
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log({
      education,
      selectedDisadvantages,
      languagePref,
      skills,
      goals
    });
    alert('Onboarding info submitted!');
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-2xl border-2 border-black">
        <h1 className="text-4xl font-extrabold text-black text-center mb-9">
          Onboarding
        </h1>
        
        <div className="w-full space-y-7">
          {/* Education */}
          <div className="space-y-2">
            <label htmlFor="education" className="block text-lg font-semibold text-black">
              Education
            </label>
            <input
              type="text"
              id="education"
              value={education}
              onChange={e => setEducation(e.target.value)}
              placeholder="Eg: 10th Pass, Graduate..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-black bg-white focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors"
              style={{ backgroundColor: 'white', color: 'black' }}
            />
          </div>

          {/* Disadvantages */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-black">
              Disadvantages (select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {disadvantageOptions.map(option => (
                <label 
                  key={option} 
                  className="flex items-center bg-gray-50 hover:bg-blue-50 rounded-2xl px-4 py-2 cursor-pointer transition-colors border border-gray-200"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedDisadvantages.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="mr-2 accent-blue-500"
                  />
                  <span className="text-black text-sm font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language Preferences */}
          <div className="space-y-2">
            <label htmlFor="languagePref" className="block text-lg font-semibold text-black">
              Language Preferences
            </label>
            <input
              type="text"
              id="languagePref"
              value={languagePref}
              onChange={e => setLanguagePref(e.target.value)}
              placeholder="Eg: Hindi, Kannada, English..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-black bg-white focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors"
              style={{ backgroundColor: 'white', color: 'black' }}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label htmlFor="skills" className="block text-lg font-semibold text-black">
              Skills (please list your relevant skills)
            </label>
            <textarea
              id="skills"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              rows="4"
              placeholder="Eg: Digital literacy, communication, cooking, driving..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-black bg-white focus:border-blue-500 focus:outline-none focus:ring-0 resize-y min-h-[100px] max-h-[200px] transition-colors"
              style={{ backgroundColor: 'white', color: 'black' }}
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <label htmlFor="goals" className="block text-lg font-semibold text-black">
              Goals (Short term goals to be achieved)
            </label>
            <textarea
              id="goals"
              value={goals}
              onChange={e => setGoals(e.target.value)}
              rows="4"
              placeholder="Eg: Java, App development, ReactJs, Web development, Python, etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-black bg-white focus:border-blue-500 focus:outline-none focus:ring-0 resize-y min-h-[100px] max-h-[200px] transition-colors"
              style={{ backgroundColor: 'white', color: 'black' }}
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;