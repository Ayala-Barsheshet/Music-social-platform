import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongsByPlaylistId
} from '../controllers/Playlist-songs.js';

const router = express.Router();

router.use(auth);

router.get('/:playlistId', getSongsByPlaylistId);
router.post('/:playlistId/songs/:songId', addSongToPlaylist);
router.delete('/:playlistId/songs/:songId', removeSongFromPlaylist);

export default router;
