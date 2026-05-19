import express from 'express';
import { getGallery, postGallery, deleteGallery } from '../controllers/galleryController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, admin, upload.single('image'), postGallery);
router.delete('/:id', protect, admin, deleteGallery);

export default router;
