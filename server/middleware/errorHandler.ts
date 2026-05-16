import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation Error',
            details: err.message,
        });
        return;
    }

    if (err.name === 'CastError') {
        res.status(400).json({
            error: 'Invalid ID format',
        });
        return;
    }

    if (err.code === 11000) {
        res.status(409).json({
            error: 'Duplicate key error',
            details: 'A record with this value already exists',
        });
        return;
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
};
