import express from 'express';
import {
  loginUser,
  registerUser,
  updateUser
} from '../controllers/Users.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.patch('/', updateUser);

export default router;
