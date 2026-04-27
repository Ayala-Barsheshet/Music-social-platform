import db from '../DB/supabase.js';

export const serviceGetSongsByPlaylistId = async (playlistId) => {
  const { data, error } = await db
    .from('playlists')
    .select(`
      name,
      description,
      playlists_songs (
        songs (
          id,
          name,
          artist_name,
          genre
        )
      )
    `)
    .eq('id', playlistId);

  if (error) throw error;

  const playlist = data[0];
  if (!playlist) return [];

  if (playlist.playlists_songs.length === 0) {
    return [{
      id: null,
      name: null,
      artist_name: null,
      genre: null,
      playlist_name: playlist.name,
      playlist_description: playlist.description,
    }];
  }

  return playlist.playlists_songs.map(({ songs: song }) => ({
    id: song?.id ?? null,
    name: song?.name ?? null,
    artist_name: song?.artist_name ?? null,
    genre: song?.genre ?? null,
    playlist_name: playlist.name,
    playlist_description: playlist.description,
  }));
};

export const serviceAddSongToPlaylist = async (playlistId, songId, userId) => {
  const { data: check, error: checkError } = await db
    .from('playlists')
    .select('*')
    .eq('id', playlistId)
    .eq('user_id', userId);

  if (checkError) throw checkError;
  if (!check || !check.length) throw new Error('Unauthorized access to playlist');

  const { error } = await db
    .from('playlists_songs')
    .upsert({ playlist_id: playlistId, song_id: songId }, { ignoreDuplicates: true });

  if (error) throw error;
};

export const serviceRemoveSongFromPlaylist = async (playlistId, songId, userId) => {
  const { data: check, error: checkError } = await db
    .from('playlists')
    .select('*')
    .eq('id', playlistId)
    .eq('user_id', userId);

  if (checkError) throw checkError;
  if (!check || !check.length) throw new Error('Unauthorized access to playlist');

  const { error } = await db
    .from('playlists_songs')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('song_id', songId);

  if (error) throw error;
};