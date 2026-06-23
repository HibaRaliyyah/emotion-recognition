import { Router } from 'express';
import { getAllUsers, getAllEmotions, getAllChats, getUserDetails } from '../controllers/adminController.js';

const router = Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users for admin dashboard
 * @access  Public (for local dev)
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get specific user details, emotions, and chats
 * @access  Public (for local dev)
 */
router.get('/users/:id', getUserDetails);

/**
 * @route   GET /api/admin/emotions
 * @desc    Get all emotions for admin dashboard
 * @access  Public (for local dev)
 */
router.get('/emotions', getAllEmotions);

/**
 * @route   GET /api/admin/chats
 * @desc    Get all chat insights for admin dashboard
 * @access  Public (for local dev)
 */
router.get('/chats', getAllChats);

export default router;
