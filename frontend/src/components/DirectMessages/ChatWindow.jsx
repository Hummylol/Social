import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { endpoint } from '../LoginSignup/endpoint.js';

const ChatWindow = ({ selectedUser, setSelectedUser, isDarkMode, currentUserId, socket, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const messagesEndRef = useRef(null);
    const contextMenuRef = useRef(null);
    const chatContainerRef = useRef(null);
    
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    const fetchMessages = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${endpoint}/messages/${selectedUser._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, [selectedUser._id]);

    useEffect(() => {
      fetchMessages();

      const handleReceiveMessage = (newMessage) => {
        setMessages(prevMessages => {
          if (!prevMessages.some(msg => msg._id === newMessage._id)) {
            const updatedMessages = [...prevMessages, newMessage];
            setTimeout(scrollToBottom, 0);
            return updatedMessages;
          }
          return prevMessages;
        });
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }, [fetchMessages, socket]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
          setContextMenu(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleSendMessage = async () => {
      if (message.trim()) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post(`${endpoint}/messages`, 
            {
              content: message,
              recipientId: selectedUser._id
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );

          const newMessage = response.data.data;
          setMessages(prevMessages => [...prevMessages, newMessage]);
          setMessage('');
          socket.emit('sendMessage', newMessage);
          scrollToBottom();
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    };

    const handleContextMenu = (e, message) => {
      e.preventDefault();
      const messageRect = e.target.getBoundingClientRect();
      const chatRect = chatContainerRef.current.getBoundingClientRect();
      
      let x, y;
      if (message.sender === selectedUser._id) {
        // For sender's messages (left side)
        x = messageRect.left - chatRect.left + 10;
        y = messageRect.top - chatRect.top + chatContainerRef.current.scrollTop + messageRect.height;
      } else {
        // For current user's messages (right side)
        x = messageRect.right - chatRect.left - 100; // Adjust based on context menu width
        y = messageRect.top - chatRect.top + chatContainerRef.current.scrollTop + messageRect.height;
      }
      
      setContextMenu({ x, y, message });
    };

    const handleCopyMessage = () => {
      navigator.clipboard.writeText(contextMenu.message.content);
      setContextMenu(null);
    };

    const handleDeleteMessage = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${endpoint}/messages/${contextMenu.message._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== contextMenu.message._id));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
      setContextMenu(null);
    };

    return (
      <div className={`chat-window relative h-[90vh] flex flex-col rounded-3xl ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <div className={`top flex shadow-md ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
          <button 
            onClick={onClose} 
            className={`p-3 ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-gray-200 text-black hover:bg-gray-300'
            } transition-colors w-1/5 rounded-tl-3xl`}
          >
            Back
          </button>
          <div className={`w-4/5 flex justify-center items-center font-semibold text-lg py-3 ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
          } rounded-tr-3xl`}>
            {selectedUser.username}
          </div>
        </div>
        <div 
          ref={chatContainerRef}
          className={`flex-grow overflow-y-auto scrollbar-hide relative ${
            isDarkMode ? 'bg-black' : 'bg-white'
          }`}
        >
          <div className="flex flex-col space-y-4 p-4">
            {messages.map((message) => (
              <div 
                key={message._id} 
                className={`flex ${message.sender === selectedUser._id ? 'justify-start' : 'justify-end'}`}
                onContextMenu={(e) => handleContextMenu(e, message)}
              >
                <div className={`p-3 max-w-[70%] ${
                  message.sender === selectedUser._id 
                    ? isDarkMode
                      ? 'bg-gray-800 text-white rounded-t-2xl rounded-br-2xl'
                      : 'bg-gray-200 text-gray-800 shadow-md rounded-t-2xl rounded-br-2xl'
                    : 'bg-blue-500 text-white rounded-t-2xl rounded-bl-2xl'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {contextMenu && (
            <div 
              ref={contextMenuRef}
              style={{
                position: 'absolute',
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
                zIndex: 1000,
              }}
              className={`border rounded-xl shadow-lg overflow-hidden w-24 ${
                isDarkMode 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-800 border-gray-200'
              }`}
            >
              <button onClick={handleCopyMessage} className={`block w-full text-left px-4 py-2 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}>Copy</button>
              {contextMenu.message.sender === currentUserId && (
                <>
                  <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  <button onClick={handleDeleteMessage} className={`block w-full text-left px-4 py-2 ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } transition-colors text-red-500`}>Delete</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className={`p-4 shadow-inner ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
          <div className='flex justify-between w-full'>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`flex-grow border rounded-full py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            />
            <button
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors'
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ChatWindow;
