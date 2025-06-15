import db from '../DB/mysql.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../auth/auth.js';


export const serviceLoginUser = async (username, password) => {
    try {

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

export const serviceUpdateUser = async (userData) => {
    try {
        const { email, phone, name, username } = userData;
        const query = ` UPDATE users SET email = ?, phone = ?, name = ? WHERE username = ? `;
        await db.promise().query(query, [email, phone, name, username]);
        const [user] = await db.promise().query(`SELECT * FROM users WHERE username = ?`, [username]);
        return user[0];
    } catch (error) {
        throw error;
    }
};

