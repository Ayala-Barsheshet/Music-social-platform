
import db from '../DB/mysql.js';
export const serviceGetAllSongs = async (accessType) => {
    try {
        // מביא את כל השירים עם שם האלבום שלהם
        const query = `
            SELECT songs.*, albums.name AS album_name
            FROM songs
            JOIN albums ON songs.album_id = albums.id
            WHERE songs.approved = 1
        `;
        const [results] = await db.promise().query(query);
        return results;
    } catch (err) {
        throw err;
    }
};

export const serviceGetSongById = async (id, accessType) => {
    try {
        //אם אתה מנהל אתה יכול לקבל שיר גם אם הוא לא אושר
        const query = 'SELECT * FROM songs WHERE id = ? AND approved = 1';
        const [results] = await db.promise().query(query, [id]);
        return results[0] || null;
    } catch (err) {
        throw err;
    }
};

export const serviceAddSong = async (album_id, name, lyrics, artist_id, genre, file_path, accessType) => {
    try {

        let approved = 0; // Default to not approved
        if (accessType === 'admin') {// If the user is an admin, set approved to 1
            approved = 1;
        }

        const [artistResult] = await db.promise().query(
            'SELECT username FROM users WHERE id = ?',
            [artist_id]
        );

        const query = `
            INSERT INTO songs (album_id, name, lyrics, artist_name, genre, file_path, created_at,approved)
            VALUES (?, ?, ?, ?, ?, ?, NOW(),?)
        `;
        const [result] = await db.promise().query(query, [album_id, name, lyrics, artistResult[0].username, genre, file_path, approved]);
        const [rows] = await db.promise().query('SELECT * FROM songs WHERE id = ?', [result.insertId]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};

export const serviceUpdateSong = async (id, fieldsToUpdate, token) => {
    try {
        if (token.accessType !== 'admin') {
            await checkArtistPermissions(id, token, fieldsToUpdate);
        }

        const keys = Object.keys(fieldsToUpdate);
        const values = Object.values(fieldsToUpdate);
        if (keys.length === 0) throw new Error('No fields to update');

        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const query = `
            UPDATE songs
            SET ${setClause}
            WHERE id = ?
        `;

        await db.promise().query(query, [...values, id]);

        const [rows] = await db.promise().query('SELECT * FROM songs WHERE id = ?', [id]);
        return rows[0];
    } catch (err) {
        throw err;
    }
};

export const serviceDeleteSong = async (id) => {
    try {
        const query = 'DELETE FROM songs WHERE id = ?';
        await db.promise().query(query, [id]);
    } catch (err) {
        throw err;
    }
};

const checkArtistPermissions = async (songId, token, fieldsToUpdate) => {
    const [songs] = await db.promise().query(
        'SELECT artist_id FROM songs WHERE id = ?', [songId]
    );

    if (!songs.length) throw new Error('Song not found');
    const song = songs[0];

    if (token.accessType === 'artist') {
        if (song.artist_id !== token.userId) {
            throw new Error('Artist can only update their own songs');
        }

        if ('approved' in fieldsToUpdate) {
            throw new Error('Artist cannot update approval status');
        }
    }
};



export const serviceGetRecommendedSongs = async (limit = 5, offset = 0) => {
    const query = `
SELECT 
  songs.*, 
  COUNT(CASE WHEN likes.liked = 1 THEN 1 END) AS likes_count
FROM songs
LEFT JOIN likes ON songs.id = likes.song_id
WHERE songs.approved = 1
GROUP BY songs.id
ORDER BY likes_count DESC
LIMIT ? OFFSET ?

    `;
    const [results] = await db.promise().query(query, [limit, offset]);
    return results;
};

export const serviceGetRecentSongs = async (limit = 5, offset = 0) => {
    const query = `
        SELECT * FROM songs
        WHERE approved = 1
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `;
    const [results] = await db.promise().query(query, [limit, offset]);
    return results;
};