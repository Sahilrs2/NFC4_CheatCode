import React from 'react';
import './App.css';

export default function Signup() {
  return (
    <div className="signup-container">
      <h1>👋 Welcome!</h1>

      <select className="language-select">
        <option>Choose Language</option>
        <option>English</option>
        <option>हिन्दी</option>
        <option>मराठी</option>
        <option>বাংলা</option>
      </select>

      <label>Full Name</label>
      <input type="text" placeholder="Enter your name" />

      <label>Phone Number</label>
      <input type="tel" placeholder="Enter phone number" />

      <label>Enter OTP</label>
      <input type="number" placeholder="OTP" />

      <button>Sign Up</button>

      <button className="help-button">I Need Help</button>

      <span className="login-link">Already registered? Login</span>
    </div>
  );
}
