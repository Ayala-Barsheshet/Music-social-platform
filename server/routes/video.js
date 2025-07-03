import express from 'express';
import { serveVideoFile } from '../controllers/video.js';

const router = express.Router();

router.get('/video/:artist/:filename', serveVideoFile);

export default router;
