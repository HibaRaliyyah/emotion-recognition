// Example usage file for MongoDB integration
// This shows how to use the database connection and models

import { connectDB } from './lib/db';
import { User, EmotionRecord, IUser, IEmotionRecord } from './models';

/**
 * Example 1: Create a new user
 */
export async function createUser(email: string, password: string, name: string) {
    try {
        await connectDB();

        const user = await User.create({
            email,
            password, // In production, hash this password!
            name,
        });

        console.log('User created:', user);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Example 2: Find a user by email
 */
export async function findUserByEmail(email: string) {
    try {
        await connectDB();

        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

/**
 * Example 3: Create an emotion record
 */
export async function createEmotionRecord(
    userId: string | undefined,
    emotions: {
        happy?: number;
        sad?: number;
        angry?: number;
        surprised?: number;
        fearful?: number;
        disgusted?: number;
        neutral?: number;
    },
    dominantEmotion: string,
    confidence: number,
    aiSuggestion?: string
) {
    try {
        await connectDB();

        const record = await EmotionRecord.create({
            userId,
            emotions,
            dominantEmotion,
            confidence,
            aiSuggestion,
        });

        console.log('Emotion record created:', record);
        return record;
    } catch (error) {
        console.error('Error creating emotion record:', error);
        throw error;
    }
}

/**
 * Example 4: Get all emotion records for a user
 */
export async function getUserEmotionRecords(userId: string) {
    try {
        await connectDB();

        const records = await EmotionRecord.find({ userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(50); // Limit to 50 records

        return records;
    } catch (error) {
        console.error('Error fetching emotion records:', error);
        throw error;
    }
}

/**
 * Example 5: Get emotion statistics for a user
 */
export async function getEmotionStats(userId: string) {
    try {
        await connectDB();

        const records = await EmotionRecord.find({ userId });

        // Calculate statistics
        const emotionCounts: Record<string, number> = {};
        records.forEach((record) => {
            emotionCounts[record.dominantEmotion] =
                (emotionCounts[record.dominantEmotion] || 0) + 1;
        });

        return {
            totalRecords: records.length,
            emotionCounts,
            averageConfidence:
                records.reduce((sum, r) => sum + r.confidence, 0) / records.length,
        };
    } catch (error) {
        console.error('Error calculating emotion stats:', error);
        throw error;
    }
}

/**
 * Example 6: Delete old emotion records (data cleanup)
 */
export async function deleteOldRecords(days: number = 30) {
    try {
        await connectDB();

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const result = await EmotionRecord.deleteMany({
            createdAt: { $lt: cutoffDate },
        });

        console.log(`Deleted ${result.deletedCount} old records`);
        return result;
    } catch (error) {
        console.error('Error deleting old records:', error);
        throw error;
    }
}
