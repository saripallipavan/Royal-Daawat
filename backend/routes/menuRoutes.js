import express from 'express';
import { getMenu, postMenu, putMenu, deleteMenu } from '../controllers/menuController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenu);
router.post('/', protect, admin, upload.single('image'), postMenu);
router.put('/:id', protect, admin, upload.single('image'), putMenu);
router.delete('/:id', protect, admin, deleteMenu);

export default router;
