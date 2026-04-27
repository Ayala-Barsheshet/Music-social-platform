import db from '../DB/supabase.js';

export const serviceGetUserPlaylists = async (userId) => {
  const { data, error } = await db
    .from('playlists')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const serviceAddPlaylist = async (name, description, userId) => {
  const { data, error } = await db
    .from('playlists')
    .insert({ name, description, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const serviceUpdatePlaylist = async (id, name, description, userId) => {
  const { data: check, error: checkError } = await db
    .from('playlists')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId);

  if (checkError) throw checkError;
  if (!check || !check.length) throw new Error('Unauthorized or playlist not found');

  const { data, error } = await db
    .from('playlists')
    .update({ name, description })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const serviceDeletePlaylist = async (id, userId) => {
  const { data: check, error: checkError } = await db
    .from('playlists')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId);

  if (checkError) throw checkError;
  if (!check || !check.length) throw new Error('Unauthorized or playlist not found');

  const { error } = await db
    .from('playlists')
    .delete()
    .eq('id', id);

  if (error) throw error;
};