import express from 'express';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotification 
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getNotifications);
router.put('/read-all', protect, admin, markAllNotificationsRead);
router.put('/:id/read', protect, admin, markNotificationRead);
router.delete('/:id', protect, admin, deleteNotification);

export default router;
