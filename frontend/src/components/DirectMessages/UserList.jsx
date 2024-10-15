import { useState, useEffect } from 'react';
import { endpoint } from '../LoginSignup/endpoint.js';
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";


const UserList = ({ isDarkMode, setSelectedUser, onClose }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const handleUserClick = (user) => {
        setSelectedUser(user);
      };

    useEffect(() => {
      fetchUsers();
    }, []);

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${endpoint}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      }
    };

    if (error) {
      return <div className={isDarkMode ? 'text-white' : 'text-black'}>Error: {error}</div>;
    }

    return (
      <div className={`flex flex-col h-screen w-[30vw] p-2 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="flex items-center mb-4">
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
          >
            <IoIosArrowBack size={24} />
          </button>
          <h2 className="text-xl font-bold ml-2">Direct Messages</h2>
        </div>
        {users.length === 0 ? (
          <div>No users available</div>
        ) : (
          users.map(user => (
            <button 
              className={`flex rounded-full gap-2 items-center pb-4 pt-2 ${
                isDarkMode 
                  ? 'border-gray-800 hover:bg-[#373737]' 
                  : 'border-gray-200 hover:bg-gray-100'
              } transition-colors relative group`} 
              onClick={() => handleUserClick(user)} 
              key={user._id}
            >
              <div className='ml-2 flex items-center justify-center rounded-full bg-[#575757] w-8 h-8'>
                {user.username.charAt(0).toUpperCase()}{user.username.charAt(user.username.length - 1).toUpperCase()}
              </div>
              {user.username}
              <div className="arrow absolute right-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <IoIosArrowDown className="transform group-hover:rotate-[-90deg] transition-transform duration-300" />
              </div>
            </button>
          ))
        )}
      </div>
    )
  }

export default UserList;
