import {
  serviceGetAlbumsByAuthorizedUsers
} from '../service/Albums.js';

export const getAlbumsByAuthorizedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accessType } = req.user;

    if (accessType === 'user') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const albums = await serviceGetAlbumsByAuthorizedUsers(userId, accessType);
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};