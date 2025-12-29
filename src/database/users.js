import bcrypt from 'bcrypt';
import { db } from './index.js';

const saltRounds = 12;

export async function signup(username, password) {
  const hash = await bcrypt.hash(password, saltRounds);
  try {
    await db.run('INSERT INTO users (login, hash) VALUES (?, ?)', username, hash);
    console.log('User registered successfully!');
    return true;
  } catch (err) {
    console.error('Error registering user:', err.message);
    return false;
  }
}

export async function login(username, password) {
  const user = await db.get('SELECT * FROM users WHERE login = ?', username);
  if (!user) return false;

  const match = await bcrypt.compare(password, user.hash);
  return match;
}

export async function isAdmin(username) {
  const user = await db.get('SELECT * FROM admin WHERE login = ?', username);
  if (!user) return false;

  return true;
}

export async function getUserId(username) {
    const user = await db.get('SELECT * FROM users WHERE login = ?', username);
    if (!user) return -1;
    return user.id;
}