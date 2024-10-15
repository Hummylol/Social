import User from '../DataBase/Model.js';
import Message from '../DataBase/Message.js';
import jwt from 'jsonwebtoken';
import { io } from '../../index.js';  // Import io from your main file

const getAllUsers = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the token and extract the userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUserId = decoded.userId;

        // Find all users except the current user
        const users = await User.find({ _id: { $ne: currentUserId } }, 'username _id');
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ error: error.message });
    }
};

const createMessage = async (req, res) => {
    try {
        const { content, recipientId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.userId;

        const newMessage = new Message({
            chat: recipientId,
            sender: senderId,
            content: content
        });

        await newMessage.save();

        // Emit socket event to both sender and recipient
        console.log('Emitting receiveMessage event:', newMessage);
        io.to(recipientId).emit('receiveMessage', newMessage);
        io.to(senderId).emit('receiveMessage', newMessage);

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error in createMessage:', error);
        res.status(500).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.userId;

        const messages = await Message.find({
            $or: [
                { sender: senderId, chat: recipientId },
                { sender: recipientId, chat: senderId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the message
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Check if the user is the sender of the message
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this message' });
        }

        // Delete the message
        await Message.findByIdAndDelete(messageId);

        // Emit socket event to notify about message deletion
        io.to(message.chat.toString()).emit('messageDeleted', messageId);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error in deleteMessage:', error);
        res.status(500).json({ error: error.message });
    }
};

export { getAllUsers, createMessage, getMessages, deleteMessage };