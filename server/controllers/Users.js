import { createToken } from '../auth/auth.js';
import {
    serviceLoginUser,
    serviceRegisterUser,
    serviceGetRequestedArtistAccess,
    serviceUpdateUserDetails
} from '../service/Users.js';

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await serviceLoginUser(username, password);

        if (!user)
            return res.status(404).json({ error: 'User not found' });

        const token = createToken(user);

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                username: user.username,
                id: user.id,
                accessType: user.access_type
            }
        });

    } catch (error) {
        if (error.message === 'Invalid username or password') {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const newUser = await serviceRegisterUser(username, password, email);

        const token = createToken(newUser);

        res.status(201).json({
            message: "User created successfully",
            token: token,
            user: {
                username: newUser.username,
                id: newUser.id,
                accessType: newUser.access_type
            }
        });

    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ error: 'Registration failed. Please try again.' });
    }
};

export const getRequestedArtistAccess = async (req, res) => {
    try {
        const { accessType } = req.user;

        if (accessType !== 'admin')
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });

        const requestedArtistAccess = await serviceGetRequestedArtistAccess();

        res.status(200).json(requestedArtistAccess);

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};

export const updateUserDetails = async (req, res) => {
    try {
        const updaterUserId = req.user.id;
        const updaterAccessType = req.user.accessType;
        const formData = req.body;

        const dataForService = { ...formData, updaterUserId, updaterAccessType };

        const updatedUser = await serviceUpdateUserDetails(dataForService);

        res.status(200).json(
            {
                username: updatedUser.username,
                id: updatedUser.id,
                accessType: updatedUser.access_type
            }
        );

    } catch (error) {

        if (
            error.message === "Only admin can change access_type" ||
            error.message === "Unauthorized to update requested_artist"
        ) {
            return res.status(403).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};
