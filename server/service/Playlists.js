import db from '../DB/mysql.js';

export const serviceGetUserPlaylists = async (userId) => {
  const [rows] = await db.promise().query(
    `SELECT * FROM playlists WHERE user_id = ?`, [userId]
  );
  return rows;
};

export const serviceAddPlaylist = async (name, bio, userId) => {
  const [result] = await db.promise().query(
    `INSERT INTO playlists (name, bio, user_id) VALUES (?, ?, ?)`,
    [name, bio, userId]
  );
  const [playlist] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ?`, [result.insertId]
  );
  return playlist[0];
};

export const serviceUpdatePlaylist = async (id, name, bio, userId) => {
  const [check] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ? AND user_id = ?`, [id, userId]
  );
  if (!check.length) throw new Error('Unauthorized or playlist not found');

  await db.promise().query(
    `UPDATE playlists SET name = ?, bio = ? WHERE id = ?`,
    [name, bio, id]
  );
  const [updated] = await db.promise().query(`SELECT * FROM playlists WHERE id = ?`, [id]);
  return updated[0];
};

export const serviceDeletePlaylist = async (id, userId) => {
  const [check] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ? AND user_id = ?`, [id, userId]
  );
  if (!check.length) throw new Error('Unauthorized or playlist not found');

  await db.promise().query(`DELETE FROM playlists WHERE id = ?`, [id]);
};
