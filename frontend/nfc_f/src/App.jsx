import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './assets/splashscreen';
import Login from './pages/login';
import Signup from './pages/signup';
import Roles from './pages/startup';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/roles" element={<Roles/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/onboarding" element={<Onboarding/>}/>
    
      </Routes>
    </Router>
  );
}
