
// import db from '../DB/mysql.js';

// export const serviceGetLikeStatus = async (user_id, song_id) => {
//   const [rows] = await db.promise().query(`
//     SELECT liked, loved FROM likes WHERE user_id = ? AND song_id = ?
//   `, [user_id, song_id]);

//   return rows.length ? rows[0] : { liked: false, loved: false };
// };

// export const serviceUpdateLikeField = async (user_id, song_id, field, value) => {
//   const [checkRows] = await db.promise().query(`
//     SELECT * FROM likes WHERE user_id = ? AND song_id = ?
//   `, [user_id, song_id]);

//   if (checkRows.length === 0) {
//     await db.promise().query(`
//       INSERT INTO likes (user_id, song_id, liked, loved)
//       VALUES (?, ?, 0, 0)
//     `, [user_id, song_id]);
//   }

//   await db.promise().query(`
//     UPDATE likes SET ${field} = ? WHERE user_id = ? AND song_id = ?
//   `, [value, user_id, song_id]);

//   const updated = await serviceGetLikeStatus(user_id, song_id);

//   return updated;
// };




import db from '../DB/mysql.js';

export const serviceGetLikeStatus = async (user_id, song_id) => {
  const [rows] = await db.promise().query(
    `SELECT liked, loved FROM likes WHERE user_id = ? AND song_id = ?`,
    [user_id, song_id]
  );

  const [[countRow]] = await db.promise().query(
    `SELECT COUNT(*) AS likeCount FROM likes WHERE song_id = ? AND liked = 1`,
    [song_id]
  );

  if (rows.length === 0) {
    rows[0] = { liked: null, loved: null };
  }
  return { likeCount: countRow.likeCount, ...rows[0] };
};

export const serviceAddLikeRow = async (user_id, song_id) => {
  await db.promise().query(
    `INSERT INTO likes (user_id, song_id, liked, loved) VALUES (?, ?, 0, 0)`,
    [user_id, song_id]
  );
};

export const serviceUpdateLikeField = async (user_id, song_id, field, value) => {
  await db.promise().query(
    `UPDATE likes SET ${field} = ? WHERE user_id = ? AND song_id = ?`,
    [value, user_id, song_id]
  );

  return serviceGetLikeStatus(user_id, song_id);
};