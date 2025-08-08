import { PrismaClient } from '@prisma/client';
import { getValidAccessToken } from '../auth/slack.js';
import axios from 'axios';

const prisma = new PrismaClient();

export function startScheduler() {
  setInterval(async () => {
    const now = new Date();
    const dueMessages = await prisma.scheduledMessage.findMany({
      where: { sent: false, sendAt: { lte: now } },
    });

    for (const msg of dueMessages) {
      try {
        const accessToken = await getValidAccessToken(msg.teamId);
        await axios.post(
          'https://slack.com/api/chat.postMessage',
          { channel: msg.channel, text: msg.text },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        await prisma.scheduledMessage.delete({
          where: { id: msg.id },
        });
        console.log(`Deleted scheduled message ID: ${msg.id}`);
      } catch (e) {
        console.error(`Error sending scheduled message ${msg.id}:`, e);
      }
    }
  }, 60000);
}


