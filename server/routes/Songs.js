import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  getAllSongs,
  getSongById,
  getRecommendedSongs,
  getRecentSongs,
  addSong,
  updateSong,
  deleteSong
} from '../controllers/Songs.js';

const router = express.Router();

router.use(auth); //every rout below this code will pass first in auth before executing the controller
router.get('/recommended', getRecommendedSongs);
router.get('/recent', getRecentSongs);

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/', addSong);
router.patch('/:id', updateSong);
router.delete('/:id', deleteSong);


export default router;