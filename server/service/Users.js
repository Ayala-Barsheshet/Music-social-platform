import db from '../DB/mysql.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../auth/auth.js';


export const serviceLoginUser = async (username, password) => {
    try {
console.log(`Attempting to log in user: ${username}`, password ? 'with password provided' : 'without password');

        const userQuery = `
            SELECT users.*, passwords.hash 
            FROM users 
            JOIN passwords ON users.id = passwords.user_id 
            WHERE users.username = ?`;

        const [users] = await db.promise().query(userQuery, [username]);

        if (!users.length) {
            throw new Error('Invalid username or password');
        }

        const user = users[0];
        const actualPassword = user.hash;

        console.log(`Comparing user.hash from db: ${user.hash}  with Password: ${password}`)

        const isMatch = await bcrypt.compare(password, actualPassword);

        console.log(`Password match result: ${isMatch}`);

        if (!isMatch) {
            throw new Error('Invalid username or password');
        }

        return user;
    } catch (error) {
        throw error;
    }
};

export const serviceRegisterUser = async (username, password, email) => {
    try {
        const userQuery = 'SELECT * FROM users WHERE username = ?';
        const [users] = await db.promise().query(userQuery, [username]);

        if (users.length) {
            throw new Error('Registration could not be completed. Please try a different username or email');
        }

        const insertUserQuery = 'INSERT INTO users (username, email, access_type, created_at) VALUES (?, ?, "user", NOW())';
        const [newUser] = await db.promise().query(insertUserQuery, [username, email]);

        const hashedPassword = await hashPassword(password);

        const insertPasswordQuery = 'INSERT INTO passwords (user_id, hash) VALUES (?, ?)';
        await db.promise().query(insertPasswordQuery, [newUser.insertId, hashedPassword]);

        return {
            id: newUser.insertId,
            username,
            access_type: 'user',
        };

    } catch (error) {
        throw error;
    }
};

// export const serviceUpdateUser = async (userData) => {
//     try {
//         const { email, phone, name, username } = userData;
//         const query = ` UPDATE users SET email = ?, phone = ?, name = ? WHERE username = ? `;
//         await db.promise().query(query, [email, phone, name, username]);
//         const [user] = await db.promise().query(`SELECT * FROM users WHERE username = ?`, [username]);
//         return user[0];
//     } catch (error) {
//         throw error;
//     }
// };

export const serviceUpdateUser = async ({ email, phone, name, currentPassword, newPassword ,user_id}) => {
  try {
    console.log("bnbvbgnhhbgfvbnmnbvbnmnbvcxvbcvbnbvcx");
    // ���������� �������� �������������� ���� ����
    console.log(`Updating user with ID: ${user_id}`);
    
    const fields = [];
    const vals = [];
    if (email) { fields.push("email = ?"); vals.push(email); }
    if (phone) { fields.push("phone = ?"); vals.push(phone); }
    if (name) { fields.push("name = ?"); vals.push(name); }

    if (fields.length) {
      vals.push(user_id);
      await db.promise().query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, vals);
    }

    // שינוי סיסמה אם יש
    if (currentPassword && newPassword) {
      const [[user]] = await db.promise().query(`
        SELECT u.id, p.hash 
        FROM users u JOIN passwords p ON u.id = p.user_id 
        WHERE u.id = ?`, [user_id]);
      if (!user) throw new Error("User not found");
      if (!await bcrypt.compare(currentPassword, user.hash)) throw new Error("Current password is incorrect");

      const hashedNewPassword = await hashPassword(newPassword);
      await db.promise().query(`UPDATE passwords SET hash = ? WHERE user_id = ?`, [hashedNewPassword, user.id]);
    }

    // ���������� ������������ ��������������
    const [[updatedUser]] = await db.promise().query(`SELECT * FROM users WHERE id = ?`, [user_id]);
    console.log("Updated user:", updatedUser);
    
    return "updatedUser";

  } catch (error) {
    throw error;
  }
};
