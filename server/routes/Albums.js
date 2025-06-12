import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  getAllAlbums,
  addAlbum,
  updateAlbum,
  deleteAlbum
} from '../controllers/Albums.js';

const router = express.Router();

router.use(auth);

router.get('/', getAllAlbums);
router.post('/', addAlbum);
router.patch('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;
