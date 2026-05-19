import express from 'express';
import { createBooking, getBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', protect, admin, getBookings);
router.put('/:id', protect, admin, updateBookingStatus);
router.delete('/:id', protect, admin, deleteBooking);

export default router;
