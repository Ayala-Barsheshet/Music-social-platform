import {
    serviceGetAllComments,
    serviceGetCommentsBySongId,
    serviceAddComment,
    serviceUpdateComment,
    serviceDeleteComment,
} from '../service/Comments.js';

export const getAllComments = async (req, res) => {
    try {
        const comments = await serviceGetAllComments();
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCommentsBySongId = async (req, res) => {
    try {
        const { songId } = req.params;
        console.log(`Fetching comments for song ID: ${songId}`);
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
        res.status(500).json({ error: err.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        await serviceDeleteComment(id, user_id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};