// import {
//   serviceGetLikeStatus,
//   serviceUpdateLikeField
// } from '../service/Likes-loves.js';

// export const updateLikeField = async (req, res) => {
//   try {
//     const user_id = req.user.id;
//     const { songId } = req.params;
//     const { field, value } = req.body;
//     console.log(`Updating ${field} for song ${songId} by user ${user_id} to ${value}`);

//     if (!['liked', 'loved'].includes(field)) {
//       return res.status(400).json({ error: 'Invalid field' });
//     }
//     const updated = await serviceUpdateLikeField(user_id, songId, field, value);
//     res.status(200).json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getLikeStatus = async (req, res) => {
//   try {
//     const user_id = req.user.id;
//     const { songId } = req.params;
//     const result = await serviceGetLikeStatus(user_id, songId);
//     res.status(200).json(result || { liked: false, loved: false });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



import {
  serviceGetLikeStatus,
  serviceUpdateLikeField,
  serviceAddLikeRow
} from '../service/Likes-loves.js';

export const getLikeStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { songId } = req.params;
    const result = await serviceGetLikeStatus(user_id, songId);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: "Like row not found" });
  }
};

export const updateLikeField = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { songId } = req.params;
    const { field, value } = req.body;
    if (!['liked', 'loved'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }
    const updated = await serviceUpdateLikeField(user_id, songId, field, value);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addLikeRow = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { songId } = req.params;
    await serviceAddLikeRow(user_id, songId);
    res.status(201).json({ message: 'Like row created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
