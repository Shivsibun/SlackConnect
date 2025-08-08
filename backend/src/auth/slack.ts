import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function exchangeCodeForTokens(code: string) {
  try {
    const res = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    });

    const data = res.data;

    if (!data.ok) {
      throw new Error(data.error || 'Unknown Slack error during token exchange');
    }
    const {access_token,refresh_token,expires_in,team} = data;

    let expiry: Date | null = null;
    if (typeof expires_in === 'number') {
      expiry = new Date(Date.now() + expires_in * 1000);
    }
    await prisma.user.upsert({
      where: { teamId: team.id },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token ?? null,
        tokenExpiry: expiry,
      },
      create: {
        teamId: team.id,
        accessToken: access_token,
        refreshToken: refresh_token ?? null,
        tokenExpiry: expiry,
      },
    });

    return { teamId: team.id };
  } catch (error: any) {
    console.error('Failed to exchange code for tokens:', error.response?.data || error.message || error);
    throw error;
  }
}
export async function getValidAccessToken(teamId: string): Promise<string> {
  try {
    const user = await prisma.user.findUnique({ where: { teamId } });

    if (!user) {
      throw new Error('User not found for teamId ' + teamId);
    }

    const now = new Date();

    if (!user.tokenExpiry || now >= user.tokenExpiry) {
      if (!user.refreshToken) {
        console.warn(
          `No refresh token available for teamId ${teamId}. Returning existing access token without refreshing.`
        );
        return user.accessToken;
      }
      const res = await axios.post('https://slack.com/api/oauth.v2.access', null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
        },
      });
      const data = res.data;

      if (!data.ok) {
        throw new Error(data.error || 'Slack token refresh failed');
      }
      const {access_token,refresh_token,expires_in} = data;

      const newExpiry = typeof expires_in === 'number' ? new Date(Date.now() + expires_in * 1000) : new Date(Date.now() + 3600 * 1000);

      await prisma.user.update({
        where: { teamId },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token ?? user.refreshToken,
          tokenExpiry: newExpiry,
        },
      });
      return access_token;
    }
    return user.accessToken;
  } catch (error: any) {
    console.error('Error obtaining valid access token:', error.response?.data || error.message || error);
    throw error;
  }
}
