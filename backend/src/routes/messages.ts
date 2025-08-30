import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getValidAccessToken } from '../auth/slack.js';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();

router.post('/send', async (req, res) => {
  const { teamId, channel, text } = req.body;

  try {
    const accessToken = await getValidAccessToken(teamId);

    await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel, text },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.status(200).send('Message sent!');
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).send('Sending message failed.');
  }
});

router.post('/schedule', async (req, res) => {
  const { teamId, channel, text, sendAt } = req.body;

  try {
    const newScheduledMessage = await prisma.scheduledMessage.create({
      data: { teamId, channel, text, sendAt: new Date(sendAt), sent: false },
    });

    res.status(200).json(newScheduledMessage);
  } catch (err) {
    console.error('Schedule message error:', err);
    res.status(500).send('Failed to schedule message.');
  }
});

router.get('/scheduled/:teamId', async (req, res) => {
  const { teamId } = req.params;

  try {
    const messages = await prisma.scheduledMessage.findMany({
      where: { teamId, sent: false },
    });
    res.json(messages);
  } catch (err) {
    console.error('Fetching scheduled messages error:', err);
    res.status(500).json({ error: 'Failed to fetch scheduled messages.' });
  }
});

router.delete('/scheduled/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.scheduledMessage.delete({ where: { id } });
    res.status(200).send('Message cancelled.');
  } catch (err) {
    console.error('Cancel scheduled message error:', err);
    res.status(500).send('Failed to cancel message.');
  }
});

export default router;
