import mongoose, { Schema, Document } from 'mongoose';

export interface IChatInsight extends Document {
    userId: mongoose.Types.ObjectId;
    userMessage: string;
    aiReply: string;
    emotionContext?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ChatInsightSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    userMessage: {
        type: String,
        required: true
    },
    aiReply: {
        type: String,
        required: true
    },
    emotionContext: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Avoid model compilation error during hot reloads
export default mongoose.models.ChatInsight || mongoose.model<IChatInsight>('ChatInsight', ChatInsightSchema);
