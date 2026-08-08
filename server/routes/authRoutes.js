import express from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
import { User } from '../models/User.js';
import { config } from '../config.js';
import { loginSchema, registerSchema } from '../utils/validators.js';

const router = express.Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      throw new HttpError(409, 'An account with this email already exists.');
    }

    const user = await User.create(payload);
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, config.jwtSecret, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email });

    if (!user || !(await user.comparePassword(payload.password))) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, config.jwtSecret, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

export default router;
