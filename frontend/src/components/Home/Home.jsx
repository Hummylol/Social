import React from 'react'
import { Link } from 'react-router-dom'

const Home = ({ isDarkMode }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className={`bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 ${isDarkMode ? 'bg-[#0e0e0e]' : 'bg-gray-100'}`}>
          <h1 className="text-4xl font-bold mb-6 text-center">Welcome</h1>
          <p className="mb-8 text-center text-lg">Experience the future of communication.</p>
          
          <AuthPrompt isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  )
}

const AuthPrompt = ({ isDarkMode }) => (
  <div className="text-center">
    <p className="text-lg mb-6">Please log in or sign up to continue:</p>
    <div className="space-y-4">
      <Button isDarkMode={isDarkMode} fullWidth to="/login">Log In</Button>
      <Button isDarkMode={isDarkMode} fullWidth to="/signup">Sign Up</Button>
    </div>
  </div>
)

const Button = ({ isDarkMode, children, fullWidth, to }) => (
  <Link 
    to={to}
    className={`
      ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
      font-bold py-3 px-6 rounded-xl
      transition duration-300 ease-in-out transform hover:scale-105
      ${fullWidth ? 'w-full' : ''}
      inline-block text-center
    `}
  >
    {children}
  </Link>
)

export default Home
