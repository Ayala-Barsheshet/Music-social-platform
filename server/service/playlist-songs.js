import db from '../DB/mysql.js';

export const serviceGetSongsByPlaylistId = async (playlistId) => {
  const [rows] = await db.promise().query(`
      SELECT 
      s.id, 
      s.name, 
      s.artist_name, 
      s.genre, 
      p.name AS playlist_name, 
      p.description AS playlist_description
      FROM playlists p
      LEFT JOIN playlists_songs ps ON p.id = ps.playlist_id
      LEFT JOIN songs s ON s.id = ps.song_id
      WHERE p.id = ?
  `, [playlistId]);
  return rows;
};

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
