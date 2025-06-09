import {
    serviceGetAllSongs,
    serviceGetSongById,
    serviceAddSong,
    serviceUpdateSong,
    serviceDeleteSong,
} from '../service/Songs.js';

export const getAllSongs = async (req, res) => {
    try {
        const accessType = req.user.accessType;  //access type from the request, got it from the token
        const Songs = await serviceGetAllSongs(accessType);
        res.status(200).json(Songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSongById = async (req, res) => {
    try {
        const accessType = req.user.accessType;  //access type from the request, got it from the token
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
        const accessType = req.user.accessType;  //access type from the request, got it from the token
        if (accessType !== 'admin' && accessType !== 'artist') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { album_id, name, lyrics, artist_name, genre, file_path } = req.body;

        const newSong = await serviceAddSong(
            album_id,
            name,
            lyrics,
            artist_name,
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
        const accessType = req.user.accessType;  //access type from the request, got it from the token
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
        const accessType = req.user.accessType;  //access type from the request, got it from the token
        if (accessType !== 'admin' && accessType !== 'artist') {
            return res.status(403).json({ message: 'Access denied' });
        }
        //גישה כמו בפטש בול
        const { id } = req.params;
        await serviceDeleteSong(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};