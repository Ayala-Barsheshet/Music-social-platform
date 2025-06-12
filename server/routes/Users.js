import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  getUserByUsername,
  addUser,
  updateUser
} from '../controllers/Users.js';

const router = express.Router();

router.use(auth); //every rout below this code will pass first in auth before executing the controller

router.get('/', getUserByUsername);
router.post('/', addUser);
router.patch('/', updateUser);

export default router;
