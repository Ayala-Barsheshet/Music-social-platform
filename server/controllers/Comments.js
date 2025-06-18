import {
    serviceGetCommentsBySongId,
    serviceAddComment,
    serviceUpdateComment,
    serviceDeleteComment,
} from '../service/Comments.js';


export const getCommentsBySongId = async (req, res) => {
    try {
        const { songId } = req.params;

        const comments = await serviceGetCommentsBySongId(songId);
        
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { song_id, title, body } = req.body;

        const newComment = await serviceAddComment(song_id, user_id, title, body);

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const fields = req.body;

        const updated = await serviceUpdateComment(id, user_id, fields);

        res.status(200).json(updated);

    } catch (err) {
        if (err.message === "You are not authorized to update this comment"
            || err.message === "Only title and body can be updated") {
            res.status(403).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const deleteComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;

        await serviceDeleteComment(id, user_id);

        res.status(204).send();
    } catch (err) {
        if (err.message === "You are not authorized to delete this comment") {
            res.status(403).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};