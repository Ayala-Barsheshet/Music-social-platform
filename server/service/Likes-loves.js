// import db from '../DB/mysql.js';

// export const serviceGetLikeStatus = async (user_id, song_id) => {
//   const [rows] = await db.promise().query(`
//     SELECT liked, loved FROM likes WHERE user_id = ? AND song_id = ?
//   `, [user_id, song_id]);
//   return rows[0];
// };
// export const serviceUpdateLikeField = async (user_id, song_id, field, value) => {
//   const current = await serviceGetLikeStatus(user_id, song_id);
//   if (!current) throw new Error("Like row not found");

//   await db.promise().query(`
//     UPDATE likes SET ${field} = ? WHERE user_id = ? AND song_id = ?
//   `, [value, user_id, song_id]);

//   const updated = { ...current, [field]: value };
//   return updated;
// };


import db from '../DB/mysql.js';

// ✅ מחזירה תמיד אובייקט עם liked/loved גם אם לא קיימת רשומה
export const serviceGetLikeStatus = async (user_id, song_id) => {
  const [rows] = await db.promise().query(`
    SELECT liked, loved FROM likes WHERE user_id = ? AND song_id = ?
  `, [user_id, song_id]);
console.log(`Fetching like status for user ${user_id} and song ${song_id}:`, rows);

  return rows.length ? rows[0] : { liked: false, loved: false };
};

// ✅ אם לא קיימת רשומה – יוצרת אחת ואז מעדכנת
export const serviceUpdateLikeField = async (user_id, song_id, field, value) => {
  const [checkRows] = await db.promise().query(`
    SELECT * FROM likes WHERE user_id = ? AND song_id = ?
  `, [user_id, song_id]);

  if (checkRows.length === 0) {
    // יצירת רשומה חדשה עם ערכים ברירת מחדל
    await db.promise().query(`
      INSERT INTO likes (user_id, song_id, liked, loved)
      VALUES (?, ?, 0, 0)
    `, [user_id, song_id]);
  }

  // עדכון השדה הרלוונטי
  await db.promise().query(`
    UPDATE likes SET ${field} = ? WHERE user_id = ? AND song_id = ?
  `, [value, user_id, song_id]);

  // שליפה מחדש כדי להחזיר את המצב העדכני
  const updated = await serviceGetLikeStatus(user_id, song_id);
  return updated;
};
