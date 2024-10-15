import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI="mongodb+srv://humaid:humaid@social.mlcys.mongodb.net/?retryWrites=true&w=majority&appName=Social";

export const connectToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};
