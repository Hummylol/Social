import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserList from '../DirectMessages/UserList'
import ChatWindow from '../DirectMessages/ChatWindow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import io from 'socket.io-client'
import { socketEndpoint } from '../LoginSignup/endpoint.js'

const socket = io(socketEndpoint, {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const UserFeed = ({ isDarkMode, toggleTheme }) => {
  const [showDM, setShowDM] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    if (username && token) {
      setUser({ username })
      const payload = JSON.parse(atob(token.split('.')[1]))
      setCurrentUserId(payload.userId)
      socket.emit('join', payload.userId)
    } else {
      navigate('/login')
    }
  }, [navigate])

  const toggleDM = () => {
    setShowDM(!showDM);
    setSelectedUser(null);
  };

  const handleChatClose = () => {
    setSelectedUser(null);
  };

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className={`relative h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-4 p-4">Welcome, {user.username}</h1>
      <div className="absolute top-2 right-4">
        <button onClick={toggleDM} className="hover:opacity-80 transition-opacity">
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      </div>
      <div 
        className={`fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out transform ${
          showDM ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedUser ? (
          <ChatWindow 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser} 
            onClose={handleChatClose}
            isDarkMode={isDarkMode}
            currentUserId={currentUserId}
            socket={socket}
          />
        ) : (
          <UserList isDarkMode={isDarkMode} setSelectedUser={setSelectedUser} onClose={toggleDM} />
        )}
      </div>
      <div className="feed-container h-[calc(100vh-100px)] overflow-y-auto">
        <div className="feed w-[30vw] mx-auto">
          <p className="text-center">Your feed will appear here.</p>
        </div>
        <div className="profile absolute bottom-4 right-4">
          <button
            onClick={() => navigate('/profile')}
            className={`pt-2 pb-2 pl-3 pr-3 ${
              isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
            } rounded-full hover:opacity-80 transition-opacity`}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>

    </div>
  )
}

export default UserFeed
