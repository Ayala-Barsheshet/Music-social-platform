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

export const serviceGetRequestedArtistAccess = async () => {
    try {

        const query = 'SELECT * FROM users WHERE requested_artist = 1';
        const [users] = await db.promise().query(query);

        return users;

    } catch (error) {
        throw error;
    }
};

export const serviceUpdateUserDetails = async ({ updaterUserId, email, phone, username, requested_artist, access_type, updaterAccessType, userIdToUpdate, currentPassword, newPassword }) => {
    try {
        // Update only provided fields
        const fields = [];
        const vals = [];
        if (email !== undefined) { fields.push("email = ?"); vals.push(email); }
        if (phone !== undefined) { fields.push("phone = ?"); vals.push(phone); }
        if (username !== undefined) { fields.push("username = ?"); vals.push(username); }

        if (fields.length) {
            vals.push(updaterUserId);
            await db.promise().query(
                `UPDATE users SET ${fields.join(", ")} WHERE id = ?`, vals);
        }

        // Handle requested_artist update 
        if (requested_artist !== undefined) {
            let targetUserId;
            if (updaterAccessType === 'admin' && userIdToUpdate !== undefined) {
                targetUserId = userIdToUpdate;
            } else if (updaterAccessType === 'user') {
                targetUserId = updaterUserId;
            } else {
                throw new Error("Unauthorized to update requested_artist");
            }
            await db.promise().query(`UPDATE users SET requested_artist = ? WHERE id = ?`, [requested_artist, targetUserId]);
        }

        // Update access_type by manager to artist
        // in order to know in controllers if renew the token with the updated access type field
        let accessTypeUpdated = false;
        if (access_type !== undefined && updaterAccessType === 'admin') {
            await db.promise().query(
                `UPDATE users SET access_type = ? WHERE id = ?`, [access_type, userIdToUpdate]);
            accessTypeUpdated = true;
        }
        
        const [[updatedUser]] = await db.promise().query(`SELECT * FROM users WHERE id = ?`, [updaterUserId]);
        return { ...updatedUser, accessTypeUpdated };

    } catch (error) {
        throw error;
    }
};