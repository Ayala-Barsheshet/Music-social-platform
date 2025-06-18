import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  getAlbumsByAuthorizedUsers,
} from '../controllers/Albums.js';

const router = express.Router();

router.use(auth);

router.get('/', getAlbumsByAuthorizedUsers);

export default router;
