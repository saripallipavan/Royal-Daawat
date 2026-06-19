import express from 'express';
import { getMedia, postMedia, putMedia, deleteMedia } from '../controllers/mediaController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMedia);
router.post('/', protect, admin, upload.single('image'), postMedia);
router.put('/:id', protect, admin, upload.single('image'), putMedia);
router.delete('/:id', protect, admin, deleteMedia);

export default router;
