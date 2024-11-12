// routes/authRoutes.ts
import { Router } from 'express';
import passport from 'passport';
import { register } from '../controllers/authController';

const router = Router();

router.post('/register', register);

router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

export default router;