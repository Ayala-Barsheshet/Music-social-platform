import {
  serviceGetLikeStatus,
  serviceUpdateLikeField
} from '../service/Likes-loves.js';

export const updateLikeField = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { songId } = req.params;
    const { field, value } = req.body;
    console.log(`Updating ${field} for song ${songId} by user ${user_id} to ${value}`);

    if (!['liked', 'loved'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    const updated = await serviceUpdateLikeField(user_id, songId, field, value);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLikeStatus = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { songId } = req.params;
    const result = await serviceGetLikeStatus(user_id, songId);
    res.status(200).json(result || { liked: false, loved: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
