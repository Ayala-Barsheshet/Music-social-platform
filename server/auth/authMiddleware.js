import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
console.log(`Token received: ${token}`); // Debugging line to check the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token: ${JSON.stringify(decoded)}`); // Debugging line to check the decoded token
    req.user = decoded; 
    console.log(`User from token: ${JSON.stringify(req.user)}`); // Debugging line to check the user info
    
    //the token exists in the request, so we can use it in the controller
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}