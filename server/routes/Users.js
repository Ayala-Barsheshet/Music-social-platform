import express from 'express';
import auth from '../auth/authMiddleware.js';
import {
  loginUser,
  registerUser,
  getRequestedArtistAccess,
  updateUserDetails
} from '../controllers/Users.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

router.use(auth);
router.get('/requested-artist-access',getRequestedArtistAccess);
router.patch('/', updateUserDetails);

export default router;
