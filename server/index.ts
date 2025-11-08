import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { messages } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(desc(messages.createdAt))
      .limit(20);
    
    res.json(userMessages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { userId, role, content } = req.body;
    
    if (!userId || !role || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [newMessage] = await db
      .insert(messages)
      .values({ userId, role, content })
      .returning();

    const messageCount = await db
      .select()
      .from(messages)
      .where(eq(messages.userId, userId));

    if (messageCount.length > 20) {
      const oldestMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .orderBy(messages.createdAt)
        .limit(messageCount.length - 20);

      if (oldestMessages.length > 0) {
        const oldestId = oldestMessages[oldestMessages.length - 1].id;
        await db.delete(messages).where(eq(messages.id, oldestId));
      }
    }

    res.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

app.delete('/api/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await db.delete(messages).where(eq(messages.userId, userId));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ error: 'Failed to delete messages' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
