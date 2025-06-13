import {createToken} from '../auth/auth.js';
import {
    serviceGetUserByUsername,
    serviceAddUser,
    serviceUpdateUser
} from '../service/Users.js';

export const getUserByUsername = async (req, res) => {
    try {
        const { username, password } = req.query;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await serviceGetUserByUsername(username, password);

        if (!user)
            return res.status(404).json({ error: 'User not found' });

        const token = createToken(user);

        res.status(200).json({
            message: "Login successful",
            token:token,
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const newUser = await serviceAddUser(username, password, email);

        const token = createToken(newUser);

        res.status(201).json({
            message: "User created successfully",
            token: token,
            username: newUser.username
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateUser = async (req, res) => {
    try {
        const formData = req.body;
        const newUser = await serviceUpdateUser(formData);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};