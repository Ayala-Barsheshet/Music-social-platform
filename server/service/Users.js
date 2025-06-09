import db from '../DB/mysql.js';

export const serviceGetUserByUsername = async (username, password) => {
    try {
        const userQuery = 'SELECT * FROM users WHERE username = ?';
        const [users] = await db.promise().query(userQuery, [username]);
        const user = users[0];
        const passwordQuery = 'SELECT hash FROM passwords WHERE user_id = ?';
        const [results] = await db.promise().query(passwordQuery, [user.id]);
        const actualPassword = results[0]?.password ;
        // || results[0]?.hash; // Handle both 'password' and 'hash' fields
        if (actualPassword !== password || !users.length)
            throw new Error('Invalid Password or username');
        return user;
    } catch (error) {
        throw error;
    }
};

export const serviceAddUser = async (username, password) => {
    try {
        const userQuery = 'SELECT * FROM users WHERE username = ?';
        const [users] = await db.promise().query(userQuery, [username]);
        if (users.length)
            throw new Error('User already exists Please Login');
        const usernameQuery = ` INSERT INTO users (username) VALUES (?)`;
        const [newUser] = await db.promise().query(usernameQuery, [username]);
        const websiteQuery = ` INSERT INTO passwords (user_id, hash) VALUES (?,?)`;
        await db.promise().query(websiteQuery, [newUser.insertId, password]);
        const user = await serviceGetUserByUsername(username, password);
        return user;
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

