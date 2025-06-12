
import db from '../DB/mysql.js';

export const serviceGetAllComments = async () => {
    const [rows] = await db.promise().query(`
        SELECT c.*, u.username FROM comments c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
    `);
    return rows;
};

export const serviceGetCommentsBySongId = async (song_id) => {
    const [rows] = await db.promise().query(`
        SELECT c.*, u.email FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.song_id = ?
        ORDER BY c.created_at DESC
    `, [song_id]);
    return rows;
};

export const serviceAddComment = async (song_id, user_id, title, body) => {
    const [result] = await db.promise().query(`
        INSERT INTO comments (song_id, user_id, title, body, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `, [song_id, user_id, title, body]);
    
    const [rows] = await db.promise().query(`SELECT * FROM comments WHERE id = ?`, [result.insertId]);
    return rows[0];
};

export const serviceUpdateComment = async (id, user_id, fields) => {
    console.log(`Checking if comment with ID ${id} belongs to user with ID ${user_id}`);
    const [existing] = await db.promise().query(`SELECT * FROM comments WHERE id = ? AND user_id = ?`, [id, user_id]);
    if (existing.length === 0) {
        throw new Error("You are not authorized to update this comment");
    }
    const allowedFields = ['title', 'body'];
    const keys = Object.keys(fields).filter(k => allowedFields.includes(k));
    const values = keys.map(k => fields[k]);
    if (keys.length === 0) throw new Error("Only title and body can be updated");
    keys.push('created_at');
    values.push(new Date());

    const setClause = keys.map(k => `${k} = ?`).join(', ');

    await db.promise().query(`
        UPDATE comments SET ${setClause}
        WHERE id = ? AND user_id = ?
    `, [...values, id, user_id]);

    const [rows] = await db.promise().query(`SELECT * FROM comments WHERE id = ?`, [id]);
    return rows[0];
};

export const serviceDeleteComment = async (id, user_id) => {
    const [check] = await db.promise().query(`SELECT * FROM comments WHERE id = ? AND user_id = ?`, [id, user_id]);
    console.log(`Check result: ${JSON.stringify(check)}`);

    if (check.length === 0) {
        throw new Error("You are not authorized to delete this comment");
    }

    await db.promise().query(`DELETE FROM comments WHERE id = ?`, [id]);
};
