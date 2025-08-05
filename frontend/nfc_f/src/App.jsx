import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './assets/splashscreen';
import Login from './pages/login';
import Signup from './pages/signup';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
  );
}
