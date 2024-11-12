// app.ts
import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import initializePassport from './config/passport';


const app: Application = express();
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}! :3`);
});

