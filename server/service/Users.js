import db from '../DB/supabase.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../auth/auth.js';

export const serviceLoginUser = async (username, password) => {
  try {
    const { data: users, error } = await db
      .from('users')
      .select('*, passwords(hash)')
      .eq('username', username);

    if (error) throw error;
    if (!users || !users.length) {
      throw new Error('Invalid username or password');
    }

    const user = { ...users[0], hash: users[0].passwords?.hash };
    delete user.passwords;

    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const serviceRegisterUser = async (username, password, email) => {
  try {
    const { data: existingUsers, error: checkError } = await db
      .from('users')
      .select('*')
      .eq('username', username);

    if (checkError) throw checkError;

    if (existingUsers && existingUsers.length) {
      const error = new Error('Username already exists');
      error.statusCode = 409;
      throw error;
    }

    const { data: newUser, error: insertError } = await db
      .from('users')
      .insert({ username, email, access_type: 'user', created_at: new Date().toISOString() })
      .select()
      .single();

    if (insertError) throw insertError;

    const hashedPassword = await hashPassword(password);

    const { error: passwordError } = await db
      .from('passwords')
      .insert({ user_id: newUser.id, hash: hashedPassword });

    if (passwordError) throw passwordError;

    return {
      id: newUser.id,
      username,
      access_type: 'user',
    };
  } catch (error) {
    throw error;
  }
};

export const serviceGetRequestedArtistAccess = async () => {
  try {
    const { data: users, error } = await db
      .from('users')
      .select('*')
      .eq('requested_artist', true);

    if (error) throw error;
    return users;
  } catch (error) {
    throw error;
  }
};

export const serviceUpdateUserDetails = async ({
  email,
  username,
  updaterUserId,
  requested_artist,
  access_type,
  updaterAccessType,
  userIdToUpdate,
}) => {
  try {
    if (email !== undefined || username !== undefined) {
      await updateUserProfile(email, username, updaterUserId);
    }

    if (requested_artist !== undefined) {
      await updateRequestedArtist(requested_artist, updaterAccessType, updaterUserId, userIdToUpdate);
    }

    if (access_type !== undefined) {
      await updateUserAccessType(access_type, updaterAccessType, userIdToUpdate);
    }

    const targetUserId =
      updaterAccessType === 'admin' && userIdToUpdate !== undefined
        ? userIdToUpdate
        : updaterUserId;

    const { data: users, error } = await db
      .from('users')
      .select('*')
      .eq('id', targetUserId);

    if (error) throw error;
    return users[0];
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (email, username, userId) => {
  const fields = {};

  if (email !== undefined) fields.email = email;
  if (username !== undefined) fields.username = username;

  if (Object.keys(fields).length) {
    const { error } = await db
      .from('users')
      .update(fields)
      .eq('id', userId);

    if (error) throw error;
  }
};

const updateRequestedArtist = async (requested_artist, updaterAccessType, updaterUserId, userIdToUpdate) => {
  let targetUserId;

  if (updaterAccessType === 'admin' && userIdToUpdate !== undefined) {
    targetUserId = userIdToUpdate;
  } else if (updaterAccessType === 'user') {
    targetUserId = updaterUserId;
  } else {
    throw new Error('Unauthorized to update requested_artist');
  }

  const { error } = await db
    .from('users')
    .update({ requested_artist })
    .eq('id', targetUserId);

  if (error) throw error;
};

const updateUserAccessType = async (access_type, updaterAccessType, userIdToUpdate) => {
  if (updaterAccessType !== 'admin') {
    throw new Error('Only admin can change access_type');
  }

  const { error } = await db
    .from('users')
    .update({ access_type })
    .eq('id', userIdToUpdate);

  if (error) throw error;
};