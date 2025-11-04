import express from 'express';
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '../controllers/notificationController.js';

import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markNotificationAsRead);
router.put('/read-all', protect, markAllNotificationsAsRead);
router.delete('/:id', protect, deleteNotification);

export default router;