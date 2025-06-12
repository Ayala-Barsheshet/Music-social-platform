import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
    getAllComments,
    getCommentsBySongId,
    addComment,
    updateComment,
    deleteComment
} from '../controllers/Comments.js';

const router = express.Router();

router.use(auth);

router.get('/', getAllComments);
router.get('/song/:songId', getCommentsBySongId);
router.post('/', addComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;


























// import express from 'express';
// import auth from '../authMiddleware.js';
// import {
//   getAllComments,
//   getCommentById,
//   addComment,
//   updateComment,
//   deleteComment
// } from '../controllers/Comments.js';

// const router = express.Router();

// router.use(auth);

// router.get('/', getAllComments);
// router.get('/:id', getCommentById);
// router.post('/', addComment);
// router.patch('/:id', updateComment);
// router.delete('/:id', deleteComment);

// export default router;