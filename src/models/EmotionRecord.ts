import mongoose, { Schema, Document } from 'mongoose';

export interface IEmotionRecord extends Document {
    userId?: mongoose.Types.ObjectId;
    emotions: {
        happy?: number;
        sad?: number;
        angry?: number;
        surprised?: number;
        fearful?: number;
        disgusted?: number;
        neutral?: number;
    };
    dominantEmotion: string;
    confidence: number;
    mixedEmotion?: string; // AI-generated mixed emotion label
    explanation?: string; // AI explanation of the emotion
    suggestions?: string[]; // AI-generated suggestions
    imageUrl?: string;
    aiSuggestion?: string; // Deprecated: use suggestions array instead
    createdAt: Date;
    updatedAt: Date;
}

const EmotionRecordSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Optional - can record anonymous entries
        },
        emotions: {
            happy: { type: Number, min: 0, max: 100 },
            sad: { type: Number, min: 0, max: 100 },
            angry: { type: Number, min: 0, max: 100 },
            surprised: { type: Number, min: 0, max: 100 },
            fearful: { type: Number, min: 0, max: 100 },
            disgusted: { type: Number, min: 0, max: 100 },
            neutral: { type: Number, min: 0, max: 100 },
        },
        dominantEmotion: {
            type: String,
            required: [true, 'Dominant emotion is required'],
            enum: ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'],
        },
        confidence: {
            type: Number,
            required: [true, 'Confidence score is required'],
            min: 0,
            max: 100,
        },
        mixedEmotion: {
            type: String,
            required: false,
        },
        explanation: {
            type: String,
            required: false,
        },
        suggestions: {
            type: [String],
            required: false,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        aiSuggestion: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
EmotionRecordSchema.index({ userId: 1, createdAt: -1 });
EmotionRecordSchema.index({ dominantEmotion: 1 });

// Prevent model recompilation in development
export default mongoose.models.EmotionRecord ||
    mongoose.model<IEmotionRecord>('EmotionRecord', EmotionRecordSchema);
