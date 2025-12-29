import { db } from './index.js';

export async function noteMessage(message, serverId, userId) {
    await db.run('INSERT INTO messages (message, serverId, userId) VALUES (?, ?, ?)', message, serverId, userId);
}