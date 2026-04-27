import db from '../DB/supabase.js';

export const serviceGetLikeStatus = async (user_id, song_id) => {
  const { data: rows, error: rowsError } = await db
    .from('likes')
    .select('liked, loved')
    .eq('user_id', user_id)
    .eq('song_id', song_id);

  if (rowsError) throw rowsError;

  const { count, error: countError } = await db
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('song_id', song_id)
    .eq('liked', true);

  if (countError) throw countError;

  const row = rows.length === 0 ? { liked: null, loved: null } : rows[0];
  return { likeCount: count, ...row };
};

export const serviceAddLikeRow = async (user_id, song_id) => {
  const { error } = await db
    .from('likes')
    .insert({ user_id, song_id, liked: false, loved: false });

  if (error) throw error;
};

export const serviceUpdateLikeField = async (user_id, song_id, field, value) => {
  const { error } = await db
    .from('likes')
    .update({ [field]: value })
    .eq('user_id', user_id)
    .eq('song_id', song_id);

  if (error) throw error;

  return serviceGetLikeStatus(user_id, song_id);
};