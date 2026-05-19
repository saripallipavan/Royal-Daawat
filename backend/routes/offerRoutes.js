import express from 'express';
import { getOffers, postOffer, putOffer, deleteOffer } from '../controllers/offerController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getOffers);
router.post('/', protect, admin, upload.single('image'), postOffer);
router.put('/:id', protect, admin, upload.single('image'), putOffer);
router.delete('/:id', protect, admin, deleteOffer);

export default router;
