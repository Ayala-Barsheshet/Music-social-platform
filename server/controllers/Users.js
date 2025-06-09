import {
    serviceGetUserByUsername,
    serviceAddUser,
    serviceUpdateUser
} from '../service/Users.js';


export const getUserByUsername = async (req, res) => {
    try {
        const { username, password } = req.query;
        const user = await serviceGetUserByUsername(username, password);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await serviceAddUser(username, password);
        const token = jwt.sign(
            {
                id: newUser._id,
                accessType: "user"
            },
            process.env.JWT_SECRET
        );
        res.status(201).json({
            message: "user created successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                accessType: user.accessType
            }
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