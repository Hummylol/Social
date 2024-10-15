import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Login = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/login', formData);

      const { message, token, username } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);  // Add this line

      console.log('Login successful:', message);
      navigate(`/userfeed`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className={`bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-[#0e0e0e]' : 'bg-gray-100'}`}>
          <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className={`w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 text-white focus:ring-white' : 'bg-white text-black focus:ring-black'}`}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className={`w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 text-white focus:ring-white' : 'bg-white text-black focus:ring-black'}`}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button isDarkMode={isDarkMode} fullWidth 
            type="submit">Log In</Button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="underline hover:text-gray-400">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Button = ({ isDarkMode, children, fullWidth, type = 'button' }) => (
  <button 
    type={type}
    className={`
      ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
      font-bold py-3 px-6 rounded-xl
      transition duration-300 ease-in-out transform hover:scale-105
      ${fullWidth ? 'w-full' : ''}
      inline-block text-center
    `}
  >
    {children}
  </button>
);

export default Login;
