import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <div className="splash-overlay"></div>
      <div className="splash-content">
        <h1 className="splash-title">Welcome</h1>
        <button onClick={()=>{navigate('/roles')}}className="get-started-btn">Get Started</button>
        <div><span  >
          Already registered? <span className="login-link" onClick={() => navigate('/login')}>Login</span> 
        </span></div>
      </div>
    </div>
  );
}
