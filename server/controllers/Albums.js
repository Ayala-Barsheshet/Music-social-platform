import {
  serviceGetAllAlbums,
  serviceAddAlbum,
  serviceUpdateAlbum,
  serviceDeleteAlbum
} from '../service/Albums.js';

export const getAlbumsByArtistId = async (req, res) => {
  try {
    const  artistId  = req.user.id;
    const albums = await serviceGetAllAlbums(artistId);
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addAlbum = async (req, res) => {
  try {
    const { name, picture, artist_id } = req.body;
    const album = await serviceAddAlbum(name, picture, artist_id);
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, picture, artist_id } = req.body;
    const updated = await serviceUpdateAlbum(id, name, picture, artist_id);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    await serviceDeleteAlbum(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
