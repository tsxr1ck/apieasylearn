import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import AdminAuth, { AdminAuthEntity } from '../models/adminAuth';
namespace Express {
  interface User {
    admin_id: number;         // Unique identifier for the admin
    email: string;            // Admin's email address
    password: string;         // Hashed password
    last_login: Date | null;  // Timestamp of last login
    created_at: Date;         // Timestamp of when the record was created
    updated_at: Date;         // Timestamp of last update
  }
}
interface User {
  admin_id: number;         // Unique identifier for the admin
  email: string;            // Admin's email address
  password: string;         // Hashed password
  last_login: Date | null;  // Timestamp of last login
  created_at: Date;         // Timestamp of when the record was created
  updated_at: Date;         // Timestamp of last update
}
export default (passport: PassportStatic) => {
  passport.use(
    'local-login',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email: string, password: string, done) => {
        try {
          const user = await AdminAuth.findByEmail(email);
          if (!user) {
            console.log('user 404')
            return done(null, false, { message: 'User not found' });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            console.log('bad password')
            return done(null, false, { message: 'Incorrect password' });
          }
          await AdminAuth.updateLastLogin(user.admin_id);
          console.log(user)
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: User, done) => {
    done(null, (user as AdminAuthEntity).admin_id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await AdminAuth.findByEmail(id.toString());
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};