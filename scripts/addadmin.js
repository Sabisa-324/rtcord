import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});
const user = process.argv[2];

await db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE NOT NULL
  )
`);

await db.run('INSERT INTO admin (login) VALUES (?)', user);