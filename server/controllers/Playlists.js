import {
  serviceGetUserPlaylists,
  serviceAddPlaylist,
  serviceUpdatePlaylist,
  serviceDeletePlaylist
} from '../service/Playlists.js';

export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.userId;
    const playlists = await serviceGetUserPlaylists(userId);
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addPlaylist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, bio } = req.body;
    const playlist = await serviceAddPlaylist(name, bio, userId);
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { name, bio } = req.body;
    const playlist = await serviceUpdatePlaylist(id, name, bio, userId);
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    await serviceDeletePlaylist(id, userId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
