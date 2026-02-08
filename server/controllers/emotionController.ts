import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { connectDB } from '../utils/db.js';
import EmotionRecord from '../../src/models/EmotionRecord.js';
import { predictEmotion } from '../services/emotionService.js';

/**
 * Predict emotion from uploaded image
 */
export const predictEmotionFromImage = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { image } = req.body;

        if (!image) {
            console.error('No image provided in request body');
            res.status(400).json({ error: 'No image provided' });
            return;
        }

        console.log(`Processing emotion prediction, image size: ${image.length} characters`);

        // Call the external emotion recognition API
        const prediction = await predictEmotion(image);

        console.log('Emotion prediction successful:', {
            dominantEmotion: prediction.dominantEmotion,
            confidence: prediction.confidence
        });

        res.status(200).json(prediction);
    } catch (error: any) {
        console.error('Predict emotion error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Return user-friendly error messages
        const statusCode = error.message?.includes('No face detected') ? 400 : 500;
        res.status(statusCode).json({
            error: error.message || 'Failed to analyze emotion. Please try again.'
        });
    }
};

/**
 * Create a new emotion record
 */
export const createEmotionRecord = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        await connectDB();

        const { emotions, dominantEmotion, confidence, imageUrl, aiSuggestion, mixedEmotion, explanation, suggestions } = req.body;
        const userId = req.userId; // Optional, from auth middleware

        const record = await EmotionRecord.create({
            userId,
            emotions,
            dominantEmotion,
            confidence,
            mixedEmotion,
            explanation,
            suggestions,
            imageUrl,
            aiSuggestion,
        });

        res.status(201).json({
            message: 'Emotion record created successfully',
            record,
        });
    } catch (error: any) {
        console.error('Create emotion record error:', error);
        res.status(500).json({ error: 'Failed to create emotion record' });
    }
};

/**
 * Get all emotion records for the current user
 */
export const getUserEmotionRecords = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        await connectDB();

        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const limit = parseInt(req.query.limit as string) || 50;
        const skip = parseInt(req.query.skip as string) || 0;

        const records = await EmotionRecord.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await EmotionRecord.countDocuments({ userId });

        res.status(200).json({
            records,
            pagination: {
                total,
                limit,
                skip,
                hasMore: skip + records.length < total,
            },
        });
    } catch (error: any) {
        console.error('Get emotion records error:', error);
        res.status(500).json({ error: 'Failed to get emotion records' });
    }
};

/**
 * Get emotion statistics for the current user
 */
export const getEmotionStats = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        await connectDB();

        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const records = await EmotionRecord.find({ userId });

        // Calculate statistics
        const emotionCounts: Record<string, number> = {};
        let totalConfidence = 0;

        records.forEach((record) => {
            emotionCounts[record.dominantEmotion] =
                (emotionCounts[record.dominantEmotion] || 0) + 1;
            totalConfidence += record.confidence;
        });

        const stats = {
            totalRecords: records.length,
            emotionCounts,
            averageConfidence: records.length > 0 ? totalConfidence / records.length : 0,
            mostFrequentEmotion: Object.entries(emotionCounts).reduce(
                (max, [emotion, count]) =>
                    count > (emotionCounts[max] || 0) ? emotion : max,
                ''
            ),
        };

        res.status(200).json({ stats });
    } catch (error: any) {
        console.error('Get emotion stats error:', error);
        res.status(500).json({ error: 'Failed to get emotion statistics' });
    }
};

/**
 * Delete an emotion record
 */
export const deleteEmotionRecord = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        await connectDB();

        const userId = req.userId;
        const recordId = req.params.id;

        if (!userId) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Find and verify ownership
        const record = await EmotionRecord.findOne({ _id: recordId, userId });
        if (!record) {
            res.status(404).json({ error: 'Record not found or unauthorized' });
            return;
        }

        await EmotionRecord.deleteOne({ _id: recordId });

        res.status(200).json({ message: 'Emotion record deleted successfully' });
    } catch (error: any) {
        console.error('Delete emotion record error:', error);
        res.status(500).json({ error: 'Failed to delete emotion record' });
    }
};
