import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string; // Optional for Stack Auth users
    name: string;
    stackAuthId?: string; // Stack Auth user ID
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: false, // Not required for Stack Auth users
            minlength: [6, 'Password must be at least 6 characters'],
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        stackAuthId: {
            type: String,
            unique: true,
            sparse: true, // Allows null values while maintaining uniqueness
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
