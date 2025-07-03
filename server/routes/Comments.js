import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
    getCommentsBySongId,
    addComment,
    updateComment,
    deleteComment
} from '../controllers/Comments.js';

const router = express.Router();

router.use(auth);

router.get('/song/:songId', getCommentsBySongId);
router.post('/', addComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
