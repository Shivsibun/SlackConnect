import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getValidAccessToken } from '../auth/slack.js';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();

// Send message immediately
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

// Schedule message in user's local time
router.post('/schedule', async (req, res) => {
  const { teamId, channel, text, sendAt, offset } = req.body;

  try {
    if (!sendAt || offset === undefined) {
      return res.status(400).send('sendAt and offset are required');
    }

    // Convert the local datetime string + offset to UTC Date
    // sendAt from frontend is like "2025-08-15T12:37"
    const [datePart, timePart] = sendAt.split('T');
    const localDate = new Date(`${datePart}T${timePart}:00`);

    // Adjust minutes by subtracting the local timezone offset
    // offset is in minutes (e.g., IST = -330)
    localDate.setMinutes(localDate.getMinutes() - offset);

    const newScheduledMessage = await prisma.scheduledMessage.create({
      data: {
        teamId,
        channel,
        text,
        sendAt: localDate, // stored as UTC date
        sent: false,
      },
    });

    res.status(200).json(newScheduledMessage);
  } catch (err) {
    console.error('Schedule message error:', err);
    res.status(500).send('Failed to schedule message.');
  }
});

// Get all scheduled messages for a team
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

// Delete scheduled message
router.delete('/scheduled/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.scheduledMessage.delete({ where: { id } });
    res.status(200).send('Message canceled.');
  } catch (err) {
    console.error('Cancel scheduled message error:', err);
    res.status(500).send('Failed to cancel message.');
  }
});

export default router;
