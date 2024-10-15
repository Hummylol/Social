import express from 'express';
import { signup, login, updateProfile } from '../controllers/loginSignup.js';
import auth from '../Middleware/auth.js'; 
import { getAllUsers, createMessage, getMessages, deleteMessage } from '../controllers/directMessages.js';

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Update Profile Route
router.put('/user/update', auth, updateProfile);

// Get all users
router.get('/users', getAllUsers);

// Direct Messages Routes

// Create a new message
router.post('/messages', auth, createMessage);

// Get messages for a specific chat
router.get('/messages/:recipientId', auth, getMessages);

// Delete a message
router.delete('/messages/:messageId', auth, deleteMessage);

export default router;