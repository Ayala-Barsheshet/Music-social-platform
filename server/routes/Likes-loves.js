import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  updateLikeField,
  getLikeStatus,
  addLikeRow
} from '../controllers/Likes-loves.js';

const router = express.Router();

router.use(auth);

router.get('/:songId', getLikeStatus);
router.patch('/:songId', updateLikeField);
router.post('/:songId', addLikeRow);

export default router;
