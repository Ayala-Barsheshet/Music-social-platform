import {
    serviceGetAllSongs,
    serviceGetSongById,
    serviceAddSong,
    serviceUpdateSong,
    serviceDeleteSong,
    serviceGetRecommendedSongs,
    serviceGetRecentSongs
} from '../service/Songs.js';


export const getRecommendedSongs = async (req, res) => {
    try {
        console.log('Fetching recommended songs...');
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        console.log(`Fetching recommended songs with limit: ${limit}, offset: ${offset}`);

        const songs = await serviceGetRecommendedSongs(limit, offset);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecentSongs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        console.log(`Fetching recommended songs with limit: ${limit}, offset: ${offset}`);
        const songs = await serviceGetRecentSongs(limit, offset);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllSongs = async (req, res) => {
    try {
        console.log('Fetching all songs...');
        console.log(`User ID: ${req.user.id}`);  // Log the user ID for debugging
        console.log(`User Access Type: ${req.user.accessType}`);  // Log the access type for debugging  


        const accessType = req.user.accessType;  //access type from the request, got it from the token
        console.log(`Access type: ${accessType}`);
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
        const accessType = req.user.accessType;
        const userId = req.user.id;  //access type from the request, got it from the token
      console.log(`Adding song with access type: ${accessType}`);
      
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