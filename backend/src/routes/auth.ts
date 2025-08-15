import { Router } from 'express';
import { exchangeCodeForTokens } from '../auth/slack.js';

const router = Router();

router.get('/slack/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('Slack OAuth error:', error);
    return res.status(403).send(`Slack OAuth failed: ${error}`);
  }

  if (!code) {
    return res.status(400).send('Missing OAuth code.');
  }

  try {
    const { teamId } = await exchangeCodeForTokens(code as string);
    // Redirect your frontend with teamId
    res.redirect(`https://slackconnect-tawny.vercel.app/?teamId=${encodeURIComponent(teamId)}`);
  } catch (err) {
    console.error('Error exchanging OAuth code:', err);
    res.status(500).send('Slack authorization failed.');
  }
});

export default router;
