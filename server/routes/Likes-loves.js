import express from 'express';
import auth from '../authMiddleware.js';
import {
  updateLikeField,
  getLikeStatus
} from '../controllers/Likes-loves.js';

const router = express.Router();
router.use(auth);

router.get('/:songId', getLikeStatus);

router.patch('/:songId', updateLikeField);

export default router;
