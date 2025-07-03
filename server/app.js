
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/Users.js';
import albumRoutes from './routes/Albums.js';
import songRoutes from './routes/Songs.js';
import playlistRoutes from './routes/Playlists.js';
import playlistSongsRoutes from './routes/playlist-songs.js';
import commentRoutes from './routes/Comments.js';
import likesLovesRoutes from './routes/Likes-loves.js';
import videoRoutes from './routes/video.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(bodyParser.json());

app.use('/cloud_storage_simulation', express.static(path.join(__dirname, 'cloud_storage_simulation')));

app.use(videoRoutes);
app.use('/users', userRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistRoutes);
app.use('/playlist-songs', playlistSongsRoutes);
app.use('/comments', commentRoutes);
app.use('/likes-loves', likesLovesRoutes);

app.listen(PORT, () => {});

