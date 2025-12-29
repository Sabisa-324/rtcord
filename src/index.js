import { db } from './database/index.js'
import { signup, login } from './database/users.js'
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
const app = express()

dotenv.config();

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
        res.status(201).send({ message: 'User created' });
    else
        res.status(500).send({ message: 'User already exists or internal server error' });
})

app.post('/api/login', async (req, res) => {
    const { loginuser, pass } = req.body;

    if (await login(loginuser, pass))
        res.status(200).send({ message: 'User logged in successfully' });
    else
        res.status(401).send({ message: 'User unauthorized' });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})