import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function authenticatePartnerToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Partner authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.role !== 'partner') {
      return res.status(403).json({ message: 'Access restricted to referral partners.' });
    }
    req.partner = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid or expired partner session.' });
  }
}
