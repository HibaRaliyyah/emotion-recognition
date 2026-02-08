import { Request, Response } from 'express';
import { connectDB } from '../utils/db.js';
import User from '../../src/models/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();

        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists with this email' });
            return;
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

/**
 * Login a user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, user.password!);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate token
        const token = generateToken(user._id.toString());

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();

        // userId is attached by auth middleware
        const userId = (req as any).userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

/**
 * Sync Stack Auth user to MongoDB
 * Creates or updates user based on Stack Auth ID
 */
export const stackAuthSync = async (req: Request, res: Response): Promise<void> => {
    try {
        await connectDB();

        const { stackUserId, email, name } = req.body;

        if (!stackUserId || !email) {
            res.status(400).json({ error: 'Stack user ID and email are required' });
            return;
        }

        // Find existing user by Stack Auth ID or email
        let user = await User.findOne({
            $or: [{ stackAuthId: stackUserId }, { email }],
        });

        if (user) {
            // Update existing user
            user.stackAuthId = stackUserId;
            user.email = email;
            user.name = name || user.name;
            await user.save();

            console.log('✅ Updated existing user from Stack Auth:', user.email);
        } else {
            // Create new user
            user = await User.create({
                stackAuthId: stackUserId,
                email,
                name: name || email.split('@')[0],
            });

            console.log('✅ Created new user from Stack Auth:', user.email);
        }

        res.status(200).json({
            message: 'User synced successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                stackAuthId: user.stackAuthId,
            },
        });
    } catch (error: any) {
        console.error('❌ Stack Auth sync error:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
};
