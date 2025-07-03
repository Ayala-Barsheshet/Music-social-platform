import {
    serviceGetMostLikedSongs,
    serviceGetRecentSongs,
    serviceGetUserFavoriteSongs,
    serviceGetUnApprovedSongs,
    serviceGetApprovedSongs,
    serviceGetSongById,
    serviceAddSong,
    serviceUpdateSong,
    serviceDeleteSong
} from '../service/Songs.js';


export const getMostLikedSongs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        const songs = await serviceGetMostLikedSongs(limit, offset);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecentSongs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        const songs = await serviceGetRecentSongs(limit, offset);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserFavoriteSongs = async (req, res) => {
    try {
        const userId = req.user.id;
        const songs = await serviceGetUserFavoriteSongs(userId);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUnapprovedSongs = async (req, res) => {
    try {
        const { accessType } = req.user;
        if (accessType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const songs = await serviceGetUnApprovedSongs();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllSongs = async (req, res) => {
    try {
        const { accessType } = req.user;
        const Songs = await serviceGetApprovedSongs();
        res.status(200).json(Songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSongById = async (req, res) => {
    try {
        const { accessType } = req.user;
        const { id } = req.params;
        const Song = await serviceGetSongById(id, accessType);
        if (!Song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json(Song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addSong = async (req, res) => {
    try {
        const { accessType } = req.user;
        const userId = req.user.id;

        if (accessType !== 'admin' && accessType !== 'artist') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { album_id, name, lyrics, genre, file_path } = req.body;
        const newSong = await serviceAddSong(
            album_id,
            name,
            lyrics,
            userId,
            genre,
            file_path,
            accessType
        );
        res.status(201).json(newSong);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSong = async (req, res) => {
    try {
        const { accessType } = req.user;
        if (accessType !== 'admin' && accessType !== 'artist') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const token = req.user;
        const { id } = req.params
        const fieldsToUpdate = req.body;

        const updatedSong = await serviceUpdateSong(id, fieldsToUpdate, token);

        res.status(200).json(updatedSong);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSong = async (req, res) => {
    try {
        const { accessType } = req.user;
        if (accessType !== 'admin' && accessType !== 'artist') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { id } = req.params;
        await serviceDeleteSong(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};