import {
    serviceGetMostLikedSongs,
    serviceGetRecentSongs,
    serviceGetUserFavoriteSongs,
    serviceGetUnApprovedSongs,
    serviceGetApprovedSongs,
    serviceGetSongById,
    serviceAddSong,
    serviceUpdateSong,
    serviceDeleteSong,
    serviceGetSongsByArtist
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

export const getArtistSongs = async (req, res) => {
    try {
        // 1. חילוץ ה-id וה-accessType שקיימים בוודאות בטוקן
        const { accessType, id: userId } = req.user;

        if (accessType !== 'artist' && accessType !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // 2. שליפת שם המשתמש מתוך טבלת המשתמשים באמצעות ה-id
        const { data: userData, error: userError } = await db
            .from('users')       // ודאי שזה שם טבלת המשתמשים שלך ב-Supabase
            .select('username')  // ודאי שזה שם עמודת השם (username / name) בטבלה
            .eq('id', userId)
            .single();           // מחזיר אובייקט יחיד ולא מערך

        if (userError || !userData) {
            return res.status(404).json({ error: "Artist profile not found" });
        }

        // 3. שימוש בשם שנמצא כדי לשלוף את השירים שלו מה-Service
        const userName = userData.username; 
        console.log("Found userName from DB:", userName);

        const songs = await serviceGetSongsByArtist(userName);
        
        // 4. החזרת השירים בצורת מערך תקין לפרונטאנד
        res.status(200).json(songs);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};