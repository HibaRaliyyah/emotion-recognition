import { Request, Response } from 'express';
import { connectDB } from '../utils/db.js';
import User from '../../src/models/User.js';
import { EmotionRecord } from './emotionController.js';
import { ChatInsight } from './chatController.js';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error: any) {
        console.error('Failed to get users:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
};

export const getAllEmotions = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();
        // Since we don't have the explicit model imported easily if it's inline in controller,
        // we might need to access it via mongoose or assume the model is defined.
        // I will use mongoose.model directly to be safe if it's already registered.
        import('mongoose').then(async (mongoose) => {
            const EmotionModel = mongoose.default.models.EmotionRecord || mongoose.default.model('EmotionRecord');
            const emotions = await EmotionModel.find({}).sort({ createdAt: -1 }).populate('userId', 'username name email');
            res.status(200).json({ emotions });
        });
    } catch (error: any) {
        console.error('Failed to get emotions:', error);
        res.status(500).json({ error: 'Failed to get emotions' });
    }
};

export const getAllChats = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();
        import('mongoose').then(async (mongoose) => {
            const ChatModel = mongoose.default.models.ChatInsight || mongoose.default.model('ChatInsight');
            const chats = await ChatModel.find({}).sort({ createdAt: -1 }).populate('userId', 'username name email');
            res.status(200).json({ chats });
        });
    } catch (error: any) {
        console.error('Failed to get chats:', error);
        res.status(500).json({ error: 'Failed to get chats' });
    }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        import('mongoose').then(async (mongoose) => {
            const EmotionModel = mongoose.default.models.EmotionRecord || mongoose.default.model('EmotionRecord');
            const ChatModel = mongoose.default.models.ChatInsight || mongoose.default.model('ChatInsight');
            
            const emotions = await EmotionModel.find({ userId: id }).sort({ createdAt: -1 });
            const chats = await ChatModel.find({ userId: id }).sort({ createdAt: -1 });
            
            res.status(200).json({
                user,
                emotions,
                chats
            });
        });
    } catch (error: any) {
        console.error('Failed to get user details:', error);
        res.status(500).json({ error: 'Failed to get user details' });
    }
};
