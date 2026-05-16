import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, stackAuthSync } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('name').trim().notEmpty().withMessage('Name is required'),
        validateRequest,
    ],
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest,
    ],
    login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   POST /api/auth/stack-sync
 * @desc    Sync Stack Auth user to MongoDB
 * @access  Public
 */
router.post(
    '/stack-sync',
    [
        body('stackUserId').notEmpty().withMessage('Stack user ID is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        validateRequest,
    ],
    stackAuthSync
);

export default router;
