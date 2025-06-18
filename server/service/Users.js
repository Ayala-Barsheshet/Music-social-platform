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
        const isMatch = await bcrypt.compare(password, actualPassword);

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
            const error = new Error('Username already exists');
            error.statusCode = 409;
            throw error;
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

export const serviceGetRequestedArtistAccess = async () => {
    try {

        const query = 'SELECT * FROM users WHERE requested_artist = 1';
        const [users] = await db.promise().query(query);

        return users;

    } catch (error) {
        throw error;
    }
};

export const serviceUpdateUserDetails = async ({
    email,
    username,
    updaterUserId,
    requested_artist,
    access_type,
    updaterAccessType,
    userIdToUpdate
}) => {
    try {
        // Update only provided fields by user himself
        if (email !== undefined || username !== undefined) {
            await updateUserProfile(email, username, updaterUserId);
        }

        // Update requested_artist by manager or user 
        if (requested_artist !== undefined) {
            await updateRequestedArtist(requested_artist, updaterAccessType, updaterUserId, userIdToUpdate);
        }

        // Update user access_type by manager
        if (access_type !== undefined) {
            await updateUserAccessType(access_type, updaterAccessType, userIdToUpdate);
        }

        // Return the updated user (after all changes)
        const targetUserId =
            updaterAccessType === 'admin' && userIdToUpdate !== undefined
                ? userIdToUpdate
                : updaterUserId;

        const [users] = await db.promise().query('SELECT * FROM users WHERE id = ?', [targetUserId]);
        return users[0];

    } catch (error) {
        throw error;
    }
};


const updateUserProfile = async (email, username, userId) => {
    const fields = [];
    const vals = [];

    if (email !== undefined) { fields.push("email = ?"); vals.push(email); }
    if (username !== undefined) { fields.push("username = ?"); vals.push(username); }

    if (fields.length) {
        vals.push(userId);
        await db.promise().query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, vals);
    }
};


const updateRequestedArtist = async (requested_artist, updaterAccessType, updaterUserId, userIdToUpdate) => {
    let targetUserId;
    if (updaterAccessType === 'admin' && userIdToUpdate !== undefined) {
        targetUserId = userIdToUpdate;
    } else if (updaterAccessType === 'user') {
        targetUserId = updaterUserId;
    } else {
        throw new Error("Unauthorized to update requested_artist");
    }

    await db.promise().query(`UPDATE users SET requested_artist = ? WHERE id = ?`, [requested_artist, targetUserId]);
};


const updateUserAccessType = async (access_type, updaterAccessType, userIdToUpdate) => {
    if (updaterAccessType !== 'admin') {
        throw new Error("Only admin can change access_type");
    }

    await db.promise().query(`UPDATE users SET access_type = ? WHERE id = ?`, [access_type, userIdToUpdate]);
};
