
import {
  serviceAddSongToPlaylist,
  serviceRemoveSongFromPlaylist,
  serviceGetSongsByPlaylistId
} from '../service/playlist-songs.js';


export const getSongsByPlaylistId = async (req, res) => {
  try {
    console.log(`Fetching songs for playlist ID: ${req.query.playlistId}`);
    const { playlistId } = req.query;
    console.log(`Fetching songs for playlist ID: ${playlistId}`);
    
    const songs = await serviceGetSongsByPlaylistId(playlistId);
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { playlistId, songId } = req.body;
    await serviceAddSongToPlaylist(playlistId, songId, userId);
    res.status(200).json({ message: 'Song added to playlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { playlistId, songId } = req.body;
    await serviceRemoveSongFromPlaylist(playlistId, songId, userId);
    res.status(200).json({ message: 'Song removed from playlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
