import db from '../DB/mysql.js';

export const serviceGetLikeStatus = async (user_id, song_id) => {
  const [rows] = await db.promise().query(`
    SELECT liked, loved FROM likes WHERE user_id = ? AND song_id = ?
  `, [user_id, song_id]);
  return rows[0];
};
export const serviceUpdateLikeField = async (user_id, song_id, field, value) => {
  const current = await serviceGetLikeStatus(user_id, song_id);
  if (!current) throw new Error("Like row not found");

  await db.promise().query(`
    UPDATE likes SET ${field} = ? WHERE user_id = ? AND song_id = ?
  `, [value, user_id, song_id]);

  const updated = { ...current, [field]: value };
  return updated;
};
