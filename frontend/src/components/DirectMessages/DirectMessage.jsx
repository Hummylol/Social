import React, { useEffect, useState, useCallback, useRef } from 'react'
import UserList from './UserList.jsx';
import io from 'socket.io-client'
import { endpoint, socketEndpoint } from '../LoginSignup/endpoint.js';
import ThemeToggle from '../ThemeToggle.jsx';
import ChatWindow from './ChatWindow.jsx';

const socket = io(socketEndpoint, {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const DirectMessage = ({ isDarkMode, toggleTheme }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

 


  <UserList />
  

  return (
    <div className={isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}>
      {selectedUser ? (
        <ChatWindow 
          selectedUser={selectedUser} 
          setSelectedUser={setSelectedUser} 
          isDarkMode={isDarkMode} 
          currentUserId={currentUserId}
          setCurrentUserId={setCurrentUserId}
        />
      ) : (
        <UserList isDarkMode={isDarkMode} setSelectedUser={setSelectedUser} />
      )}
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  )
}

export default DirectMessage
