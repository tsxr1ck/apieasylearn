// app.ts
import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import initializePassport from './config/passport';
import cors from 'cors';

const app: Application = express();
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'https://admin.easylearnacademy.mx/', // Allow your frontend origin
  methods: ['GET', 'POST'],       // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

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

app.listen(3003, () => {
  console.log('Server is running on port 3003');
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EasyLearnAcademy API</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
          }
          .container {
            text-align: center;
            padding: 20px;
            border: 2px solid #4a90e2;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 2em;
            color: #4a90e2;
            margin: 0;
          }
          p {
            font-size: 1.2em;
            margin-top: 10px;
            color: #666;
          }
          .version {
            font-size: 1em;
            font-style: italic;
            color: #999;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>EasyLearnAcademy API</h1>
          <p>Welcome to the official API!</p>
          <p class="version">Version: v0.1.1</p>
        </div>
      </body>
    </html>
  `);
});