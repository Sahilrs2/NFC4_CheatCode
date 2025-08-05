import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './assets/splashscreen';
import Login from './pages/login';
import Signup from './pages/signup';
import Roles from './pages/startup';
import Dashboard from './pages/dashboard';
import Onboarding from './pages/onboarding';

import SkillTest from './pages/skilltest';
import Chatbot from './pages/chatbot';

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
         <Route path="/chatbot" element={<Chatbot/>}/>
        <Route path="/skilltest" element={<SkillTest/>}/>
    
      </Routes>
    </Router>

    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/roles" element={<Roles/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding/>
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>

  );
}
