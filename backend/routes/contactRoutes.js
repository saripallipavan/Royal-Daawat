import express from 'express';
import { getContact, postContact } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getContact);
router.post('/', postContact);

export default router;
