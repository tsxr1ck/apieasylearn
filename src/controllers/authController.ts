// controllers/authController.ts
import { Request, Response } from 'express';
import AdminAuth from '../models/adminAuth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const existingUser = await AdminAuth.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    const newUser = await AdminAuth.create(email, password);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await AdminAuth.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { userId: user.admin_id, email: user.email },
      'your_jwt_secret_key', // Store this securely as an environment variable
      { expiresIn: '1h' }
    );
    await AdminAuth.updateLastLogin(user.admin_id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { admin_id: user.admin_id, email: user.email },
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
    return;
  }
}