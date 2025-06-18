
import {
  serviceAddSongToPlaylist,
  serviceRemoveSongFromPlaylist,
  serviceGetSongsByPlaylistId
} from '../service/Playlist-songs.js';


export const getSongsByPlaylistId = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const songs = await serviceGetSongsByPlaylistId(playlistId);
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistId, songId } = req.params;
    await serviceAddSongToPlaylist(playlistId, songId, userId);
    res.status(200).json({ message: 'Song added to playlist' });
  } catch (err) {
    if (err.message === 'Unauthorized access to playlist') {
      res.status(403).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistId, songId } = req.params;
    await serviceRemoveSongFromPlaylist(playlistId, songId, userId);
    res.status(200).json({ message: 'Song removed from playlist' });
  } catch (err) {
    if (err.message === 'Unauthorized access to playlist') {
      res.status(403).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};
