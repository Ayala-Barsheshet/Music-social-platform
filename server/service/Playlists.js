import db from '../DB/mysql.js';

export const serviceGetUserPlaylists = async (userId) => {
  const [rows] = await db.promise().query(
    `SELECT * FROM playlists WHERE user_id = ?`, [userId]
  );
  console.log("////////////s",rows);
  
  return rows;
};

export const serviceAddPlaylist = async (name, description, userId) => {
  const [result] = await db.promise().query(
    `INSERT INTO playlists (name, description, user_id) VALUES (?, ?, ?)`,
    [name, description, userId]
  );
  const [playlist] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ?`, [result.insertId]
  );
  return playlist[0];
};

export const serviceUpdatePlaylist = async (id, name, description, userId) => {
  const [check] = await db.promise().query(
    `SELECT * FROM playlists WHERE id = ? AND user_id = ?`, [id, userId]
  );
  if (!check.length) throw new Error('Unauthorized or playlist not found');

  await db.promise().query(
    `UPDATE playlists SET name = ?, description = ? WHERE id = ?`,
    [name, description, id]
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
