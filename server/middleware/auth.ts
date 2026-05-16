import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';

// Extend Express Request to include userId
export interface AuthRequest extends Request {
    userId?: string;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches userId to request
 */
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        // Attach userId to request
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Optional authentication middleware
 * Attaches userId if token is present, but doesn't require it
 */
export const optionalAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyToken(token);

            if (decoded) {
                req.userId = decoded.userId;
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};
