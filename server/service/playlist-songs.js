import db from '../DB/mysql.js';

export const serviceAddSongToPlaylist = async (playlistId, songId, userId) => {
  const [check] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ? AND user_id = ?`, [playlistId, userId]
  );
  if (!check.length) throw new Error('Unauthorized access to playlist');

  await db.promise().query(
    `INSERT IGNORE INTO playlists_songs (playlist_id, song_id) VALUES (?, ?)`,
    [playlistId, songId]
  );
};

export const serviceRemoveSongFromPlaylist = async (playlistId, songId, userId) => {
  const [check] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ? AND user_id = ?`, [playlistId, userId]
  );
  if (!check.length) throw new Error('Unauthorized access to playlist');

  await db.promise().query(
    `DELETE FROM playlists_songs WHERE playlist_id = ? AND song_id = ?`,
    [playlistId, songId]
  );
};

export const serviceGetSongsByPlaylistId = async (playlistId) => {
    console.log(`Fetching songs for playlist ID: ${playlistId}`);
    
  const [rows] = await db.promise().query(`
    SELECT s.*
    FROM playlists_songs ps
    JOIN songs s ON ps.song_id = s.id
    WHERE ps.playlist_id = ?
  `, [playlistId]);
  return rows;
};

