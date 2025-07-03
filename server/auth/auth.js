import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (clientPassword) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(clientPassword, saltRounds);
  return hashedPassword;
};

export const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      accessType: user.access_type || "user", // Default to "user" if accessType is not provided
    },
    process.env.JWT_SECRET
  );
};

export default {hashPassword, createToken};
