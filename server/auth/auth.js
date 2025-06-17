import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (clientPassword) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  return await bcrypt.hash(clientPassword, saltRounds);
};

export const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      accessType: user.access_type || "user"
    },
    process.env.JWT_SECRET
    //, { expiresIn: '1h' }
  );
};

export default {hashPassword, createToken};
