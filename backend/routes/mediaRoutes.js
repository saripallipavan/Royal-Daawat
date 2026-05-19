import express from 'express';
import { getMedia, postMedia } from '../controllers/mediaController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMedia);
router.post('/', protect, admin, upload.single('image'), postMedia);

export default router;
