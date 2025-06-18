import db from '../DB/mysql.js';

export const serviceGetAlbumsByAuthorizedUsers = async (userId, accessType) => {
  const query = accessType === 'admin'
    ? 'SELECT * FROM albums'
    : 'SELECT * FROM albums WHERE artist_id = ?';
  const params = accessType === 'admin' ? [] : [userId];
  const [rows] = await db.promise().query(query, params);
  return rows;
};
