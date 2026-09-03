import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpError } from '../lib/httpError.js';

export function authenticateToken(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next(new HttpError(401, 'Authentication required.'));
    return;
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    next(new HttpError(403, 'Invalid or expired session.'));
  }
}

/**
 * Partner-only authentication middleware.
 * Verifies JWT and enforces role === 'partner'.
 * Partner tokens are completely isolated from buyer/plant_partner tokens.
 */
export function authenticatePartnerToken(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next(new HttpError(401, 'Partner authentication required.'));
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded.role !== 'partner') {
      next(new HttpError(403, 'Access restricted to referral partners.'));
      return;
    }
    req.partner = decoded;
    next();
  } catch {
    next(new HttpError(403, 'Invalid or expired partner session.'));
  }
}

