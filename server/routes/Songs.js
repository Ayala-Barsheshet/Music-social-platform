import express from 'express';
import auth from '../authMiddleware.js';
import {
  getAllSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong
} from '../controllers/Songs.js';

router.use(auth); //every rout below this code will pass first in auth before executing the controller

const router = express.Router();

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/', addSong);
router.patch('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;