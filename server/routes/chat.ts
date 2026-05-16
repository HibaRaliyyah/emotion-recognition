import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validator.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { handleChatJournal, getChatInsights } from '../controllers/chatController.js';

const router = Router();

/**
 * @route   POST /api/chat/journal
 * @desc    AI-powered emotion journal chat
 * @access  Public (optional auth)
 */
router.post(
    '/journal',
    [
        optionalAuth,
        body('message').notEmpty().withMessage('Message is required'),
        validateRequest,
    ],
    handleChatJournal
);

/**
 * @route   GET /api/chat/insights
 * @desc    Get all stored chat insights for the current user
 * @access  Private
 */
router.get(
    '/insights',
    [authenticate],
    getChatInsights
);

export default router;
