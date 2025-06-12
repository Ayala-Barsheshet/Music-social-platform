import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongsByPlaylistId
} from '../controllers/playlist-songs.js';

const router = express.Router();

router.use(auth);

router.get('/', getSongsByPlaylistId);
router.post('/', addSongToPlaylist);
router.delete('/', removeSongFromPlaylist);

export default router;
