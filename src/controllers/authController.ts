// controllers/authController.ts
import { Request, Response } from 'express';
import AdminAuth from '../models/adminAuth';

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
