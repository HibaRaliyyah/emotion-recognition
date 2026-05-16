import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from '../server/utils/db.js';
import { errorHandler, notFoundHandler } from '../server/middleware/errorHandler.js';
import authRoutes from '../server/routes/auth.js';
import emotionRoutes from '../server/routes/emotions.js';
import chatRoutes from '../server/routes/chat.js';

// Load environment variables
dotenv.config();

const app: Application = express();

const CLIENT_URL = process.env.CLIENT_URL || 'https://emotion-compass.vercel.app';

// Security middleware
app.use(helmet());

// CORS — allow the deployed Vercel domain and localhost for dev
app.use(
    cors({
        origin: [
            'https://emotion-compass.vercel.app',
            'http://localhost:5173',
            CLIENT_URL,
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parser with increased size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect DB eagerly (Vercel keeps functions warm between invocations)
connectDB().catch(console.error);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/chat', chatRoutes);

// 404 + error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
