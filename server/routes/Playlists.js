import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  getUserPlaylists,
  addPlaylist,
  updatePlaylist,
  deletePlaylist
} from '../controllers/Playlists.js';

const router = express.Router();

router.use(auth);

router.get('/', getUserPlaylists);
router.post('/', addPlaylist);
router.patch('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

export default router;
