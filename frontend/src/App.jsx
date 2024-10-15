import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserFeed from './components/Feed/UserFeed'
import Login from './components/LoginSignup/Login'
import Signup from './components/LoginSignup/Signup'
import Home from './components/Home/Home'
import Profile from './components/Feed/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import ThemeToggle from './components/ThemeToggle'

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('isDarkMode', newMode);
      return newMode;
    });
  };

  // Retrieve theme preference from localStorage on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem('isDarkMode');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'true');
    }
  }, []);

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        {/* Place ThemeToggle inside Router but outside Routes to make it global */}
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
          <Route path="/signup" element={<Signup isDarkMode={isDarkMode} />} />
          <Route 
            path="/userfeed" 
            element={
              <ProtectedRoute>
                <UserFeed isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile isDarkMode={isDarkMode} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App