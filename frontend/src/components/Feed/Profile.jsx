import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { endpoint } from '../LoginSignup/endpoint.js'
import { toast, Toaster } from 'sonner'
import { motion } from 'framer-motion' // Importing Framer Motion

const Profile = ({ isDarkMode }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${endpoint}/user/update`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Profile updated successfully!')
      // Clear sensitive fields after successful update
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while updating the profile'
      toast.error(errorMessage)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#000000] text-white' : 'bg-white text-black'} transition-colors duration-500`}>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: `my-toast-class ${isDarkMode ? 'dark-toast' : 'light-toast'}`,
          style: {
            background: isDarkMode ? '#333' : '#fff',
            color: isDarkMode ? '#fff' : '#333',
          },
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold mb-8 text-center transition-transform duration-300 hover:scale-105">User Profile</h1>
        
        <form onSubmit={handleSubmit} className={`max-w-md mx-auto ${isDarkMode ? 'bg-[#111111]' : 'bg-[#f0f0f0]'} shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 border-opacity-20 transition-all duration-500`}>
          {['currentPassword', 'newUsername', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field} className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                className={`appearance-none border-b-2 w-full py-2 px-3 ${
                  isDarkMode ? 'bg-[#111111] border-white text-white' : 'bg-[#f0f0f0] border-black text-black'
                } border-opacity-20 leading-tight focus:outline-none focus:border-opacity-100 transition-all duration-300 transform focus:scale-105`}
                id={field}
                type={field.includes('Password') ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}`}
              />
            </div>
          ))}
          <div className="flex items-center justify-center mt-8">
            <button
              className={`${isDarkMode ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-black text-white hover:bg-[#333333]'} font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Motion logout button */}
      <motion.button
        onClick={handleLogout}
        className={`fixed bottom-6 right-6 p-4 transition-all duration-300 ${
          isDarkMode ? 'bg-red-600 text-black' : 'bg-red-600 text-white'
        } rounded-full shadow-lg group`}
        initial={{ width: '60px' }} // Initial width
        whileHover={{ width: '130px' }} // Animate width on hover
        transition={{ type: 'spring', damping: 20 }} // Smooth transition using spring physics
      >
        <motion.div className="flex items-center justify-center">
          {/* Animate the icon */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            whileHover={{ x: -10 }} // Moves slightly to the left on hover
            transition={{ duration: 0.3 }}
          >
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              className="text-xl"
            />
          </motion.div>

          {/* Animate the text */}
          <motion.span
            className="ml-2"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }} // Fade in and move into place on hover
            transition={{ duration: 0.3, delay: 0.1 }} // Slight delay for a smoother effect
          >
            Logout
          </motion.span>
        </motion.div>
      </motion.button>
    </div>
  )
}

export default Profile
