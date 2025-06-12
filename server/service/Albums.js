import db from '../DB/mysql.js';

export const serviceGetAllAlbums = async () => {
  const [rows] = await db.promise().query(`
    SELECT * FROM albums
  `);
  //אפשר להוסיף לימיטטטט
  return rows;
};

export const serviceAddAlbum = async (name, picture, artist_id) => {
  const [result] = await db.promise().query(`
    INSERT INTO albums (name, picture, artist_id) VALUES (?, ?, ?)
  `, [name, picture, artist_id]);

  const [album] = await db.promise().query(`
    SELECT * FROM albums WHERE id = ?
  `, [result.insertId]);

  return album[0];
};

export const serviceUpdateAlbum = async (id, name, picture, artist_id) => {
  await db.promise().query(`
    UPDATE albums SET name = ?, picture = ?, artist_id = ? WHERE id = ?
  `, [name, picture, artist_id, id]);

  const [updated] = await db.promise().query(`
    SELECT * FROM albums WHERE id = ?
  `, [id]);

  return updated[0];
};

export const serviceDeleteAlbum = async (id) => {
  await db.promise().query(`
    DELETE FROM albums WHERE id = ?
  `, [id]);
};
