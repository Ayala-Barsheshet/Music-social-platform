import db from '../DB/supabase.js';

export const serviceGetMostLikedSongs = async (limit = 5, offset = 0) => {
  const { data, error } = await db
    .from('songs')
    .select('*, likes(liked)')
    .eq('approved', true)
    .eq('likes.liked', true)
    .range(offset, offset + limit - 1);

  if (error) throw error;

  // Count likes per song, filter out songs with 0 likes, sort by count
  const withCounts = data
    .map(song => ({
      ...song,
      likes_count: song.likes?.length ?? 0,
      likes: undefined,
    }))
    .filter(song => song.likes_count > 0)
    .sort((a, b) => b.likes_count - a.likes_count);

  return withCounts;
};

export const serviceGetRecentSongs = async (limit = 5, offset = 0) => {
  const { data, error } = await db
    .from('songs')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};

export const serviceGetUserFavoriteSongs = async (userId) => {
  try {
    const { data, error } = await db
      .from('songs')
      .select('*, likes!inner(user_id, loved)')
      .eq('likes.user_id', userId)
      .eq('likes.loved', true);

    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
};

export const serviceGetUnApprovedSongs = async () => {
  try {
    const { data, error } = await db
      .from('songs')
      .select('id, name, genre, file_path, approved')
      .eq('approved', false);

    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
};

export const serviceGetApprovedSongs = async () => {
  try {
    const { data, error } = await db
      .from('songs')
      .select('*, albums(name)')
      .eq('approved', true);

    if (error) throw error;

    // Flatten albums.name -> album_name to match original shape
    return data.map(({ albums, ...rest }) => ({ ...rest, album_name: albums?.name }));
  } catch (err) {
    throw err;
  }
};

export const serviceGetSongById = async (id, accessType) => {
  try {
    let query = db.from('songs').select('*').eq('id', id);

    if (accessType !== 'admin') {
      query = query.eq('approved', true);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data || null;
  } catch (err) {
    throw err;
  }
};

export const serviceAddSong = async (album_id, name, lyrics, artist_id, genre, file_path, accessType) => {
  try {
    const approved = accessType === 'admin' ? true : false;

    const { data: artistResult, error: artistError } = await db
      .from('users')
      .select('username')
      .eq('id', artist_id)
      .single();

    if (artistError) throw artistError;

    const { data, error } = await db
      .from('songs')
      .insert({
        album_id,
        name,
        lyrics,
        artist_name: artistResult.username,
        genre,
        file_path,
        created_at: new Date().toISOString(),
        approved,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
};

export const serviceDeleteSong = async (id) => {
  try {
    const { error } = await db
      .from('songs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    throw err;
  }
};

export const serviceUpdateSong = async (id, fieldsToUpdate, token) => {
  try {
    if (token.accessType !== 'admin') {
      await checkArtistPermissions(id, token, fieldsToUpdate);
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) throw new Error('No fields to update');

    const { data, error } = await db
      .from('songs')
      .update(fieldsToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
};

const checkArtistPermissions = async (songId, token, fieldsToUpdate) => {
  const { data: songs, error } = await db
    .from('songs')
    .select('artist_id')
    .eq('id', songId);

  if (error) throw error;
  if (!songs || !songs.length) throw new Error('Song not found');

  const song = songs[0];

  if (token.accessType === 'artist') {
    if (song.artist_id !== token.userId) {
      throw new Error('Artist can only update their own songs');
    }

    if ('approved' in fieldsToUpdate) {
      throw new Error('Artist cannot update approval status');
    }
  }
};