import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (clientPassword) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  console.log("Password before hash:", clientPassword);
  const hashedPassword = await bcrypt.hash(clientPassword, saltRounds);
  console.log("Password after hash:", hashedPassword);
  return hashedPassword;
};

export const createToken = (user) => {
  console.log(`Creating token for user ID: ${user.id}, Access Type: ${user.accessType}`);
  
  return jwt.sign(
    {
      id: user.id,
      accessType: user.access_type || "user", // Default to "user" if accessType is not provided
    },
    process.env.JWT_SECRET
    //, { expiresIn: '1h' }
  );
};

export default {hashPassword, createToken};
