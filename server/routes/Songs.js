import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  getMostLikedSongs,
  getRecentSongs,
  getUserFavoriteSongs,
  getUnapprovedSongs,
  getAllSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong
} from '../controllers/Songs.js';

const router = express.Router();

router.use(auth); 

router.get('/most-liked', getMostLikedSongs);
router.get('/recent', getRecentSongs);
router.get('/user-favorites', getUserFavoriteSongs);
router.get('/unapproved', getUnapprovedSongs);

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/', addSong);
router.patch('/:id', updateSong);
router.delete('/:id', deleteSong);


export default router;