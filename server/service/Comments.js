import db from '../DB/supabase.js';

export const serviceGetCommentsBySongId = async (song_id) => {
  const { data, error } = await db
    .from('comments')
    .select('*, users(email)')
    .eq('song_id', song_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Flatten users.email -> email to match original shape
  return data.map(({ users, ...rest }) => ({ ...rest, email: users?.email }));
};

export const serviceAddComment = async (song_id, user_id, title, body) => {
  const { data, error } = await db
    .from('comments')
    .insert({ song_id, user_id, title, body, created_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const serviceUpdateComment = async (id, user_id, fields) => {
  const { data: existing, error: checkError } = await db
    .from('comments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user_id);

  if (checkError) throw checkError;
  if (!existing || existing.length === 0) {
    throw new Error('You are not authorized to update this comment');
  }

  const allowedFields = ['title', 'body'];
  const keys = Object.keys(fields).filter(k => allowedFields.includes(k));
  if (keys.length === 0) throw new Error('Only title and body can be updated');

  const updatePayload = {};
  keys.forEach(k => { updatePayload[k] = fields[k]; });
  updatePayload.created_at = new Date().toISOString();

  const { data, error } = await db
    .from('comments')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user_id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const serviceDeleteComment = async (id, user_id) => {
  const { data: check, error: checkError } = await db
    .from('comments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user_id);

  if (checkError) throw checkError;
  if (!check || check.length === 0) {
    throw new Error('You are not authorized to delete this comment');
  }

  const { error } = await db
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};