import db from '../DB/supabase.js';
 
export const serviceGetAlbumsByAuthorizedUsers = async (userId, accessType) => {
  let query = db.from('albums').select('*');
 
  if (accessType !== 'admin') {
    query = query.eq('artist_id', userId);
  }
 
  const { data, error } = await query;
  if (error) throw error;
  return data;
};
 