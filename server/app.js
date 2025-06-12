import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/Users.js';
import albumRoutes from './routes/Albums.js';
import songRoutes from './routes/Songs.js';
import playlistRoutes from './routes/Playlists.js'; 
import playlistSongesRoutes from './routes/playlist-songs.js';
import commentRoutes from './routes/Comments.js';
import likesLovesRoutes from './routes/Likes-loves.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/albums', albumRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistRoutes);
app.use('/playlist-songs', playlistSongesRoutes);
app.use('/comments', commentRoutes);
app.use('/likes-loves', likesLovesRoutes);

//for testing 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});