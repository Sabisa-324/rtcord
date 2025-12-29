import { db } from './database/index.js'
import { signup, login, isAdmin } from './database/users.js'
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';

const app = express()
dotenv.config();

app.use(session({
  name: 'rtcord.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));

let port = process.env.PORT
if (port == null)
    port = 7777

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL
  )
`);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/signup', async (req, res) => {
    const { login, pass } = req.body;

    if (await signup(login, pass))
        res.status(201).send({ message: 'User created, you need to login again cuz me lazy' });
    else
        res.status(500).send({ message: 'User already exists or internal server error' });
})

app.post('/api/login', async (req, res) => {
    const { loginuser, pass } = req.body;

    if (await login(loginuser, pass)) {
        req.session.user = {
            login: loginuser
        };
        res.status(200).send({ message: 'User logged in successfully' });
    }
    else
        res.status(401).send({ message: 'User unauthorized' });
})

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('Not logged in');
  }
  next();
}

app.get('/admin', requireAuth, async (req, res) => {
  //res.json(req.session.user);
  if (!(await isAdmin(req.session.user.login))) {
    return res.status(403).send('Unauthorized');
  }

  res.send('wil be admin panel');
});


app.listen(port, () => {
  console.log('')
  console.log('')
  console.log('RtCord seber softwar')
  console.log('copyrigh -69 me inc')
  console.log(`Example app listening on port ${port}`)
})