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
        if (error.message === 'Invalid username or password') {//an error from server
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
        res.status(500).json({ error: error.message });
    }
};

export const getRequestedArtistAccess = async (req, res) => {
    try {
        const accessType = req.user.accessType;
        if (accessType !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }
        const requestedArtists = await serviceGetRequestedArtistAccess();
        res.status(200).json(requestedArtists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserDetails = async (req, res) => {
    try {
        const updaterUserId = req.user.id;
        const updaterAccessType = req.user.accessType;
        const formData = { ...req.body, updaterUserId, updaterAccessType };
        const newUser = await serviceUpdateUserDetails(formData);

        let token = null;
        if (newUser.accessTypeUpdated) {
            token = createToken(newUser); // If accessType was updated, create a new token
        }

        const response = { user: newUser };
        if (token) response.token = token;
        console.log("in controller:::response.user", response.user, "response.token", response.token);

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
