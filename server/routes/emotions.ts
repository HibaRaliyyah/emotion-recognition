import { Router } from 'express';
import { body } from 'express-validator';
import {
    createEmotionRecord,
    getUserEmotionRecords,
    getEmotionStats,
    deleteEmotionRecord,
    predictEmotionFromImage,
} from '../controllers/emotionController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';

const router = Router();

/**
 * @route   POST /api/emotions/predict
 * @desc    Predict emotion from image
 * @access  Public (optional auth)
 */
router.post(
    '/predict',
    [
        optionalAuth,
        body('image').notEmpty().withMessage('Image data is required'),
        validateRequest,
    ],
    predictEmotionFromImage
);

/**
 * @route   POST /api/emotions
 * @desc    Create a new emotion record
 * @access  Public (optional auth)
 */
router.post(
    '/',
    [
        optionalAuth,
        body('emotions').isObject().withMessage('Emotions must be an object'),
        body('dominantEmotion')
            .isIn(['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'])
            .withMessage('Invalid dominant emotion'),
        body('confidence')
            .isFloat({ min: 0, max: 100 })
            .withMessage('Confidence must be between 0 and 100'),
        validateRequest,
    ],
    createEmotionRecord
);

/**
 * @route   GET /api/emotions
 * @desc    Get all emotion records for the current user
 * @access  Private
 */
router.get('/', authenticate, getUserEmotionRecords);

/**
 * @route   GET /api/emotions/stats
 * @desc    Get emotion statistics for the current user
 * @access  Private
 */
router.get('/stats', authenticate, getEmotionStats);

/**
 * @route   DELETE /api/emotions/:id
 * @desc    Delete an emotion record
 * @access  Private
 */
router.delete('/:id', authenticate, deleteEmotionRecord);

export default router;
