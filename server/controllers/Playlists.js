import {
  serviceGetUserPlaylists,
  serviceAddPlaylist,
  serviceUpdatePlaylist,
  serviceDeletePlaylist
} from '../service/Playlists.js';

export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`User ID from token in playlist controller: ${userId}`); // Debugging line to check the user ID
    const playlists = await serviceGetUserPlaylists(userId);
      console.log("////////////c",playlists);
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    const playlist = await serviceAddPlaylist(name, description, userId);
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description } = req.body;
    console.log(`Updating playlist ID: ${id} for user ID: ${userId}, name: ${name}, description: ${description}`); // Debugging line to check the IDs
    const playlist = await serviceUpdatePlaylist(id, name, description, userId);
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await serviceDeletePlaylist(id, userId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
