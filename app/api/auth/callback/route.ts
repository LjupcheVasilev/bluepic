import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session'
import { NextResponse } from 'next/server';
import { Session } from '../types';
import { getUrl } from '@/lib/getUrl';
import { getClient } from '@/lib/oauthClient';

export const GET = async (req: Request, res: Response) => {
  const params = new URLSearchParams(req.url.split("?")[1]);
  try {
    // Create OAuth client
    const oauthClient = await getClient();
    const { session } = await oauthClient.callback(params);
    const clientSession = await getIronSession<Session>(await cookies(), {
      cookieName: "sid",
      password: process.env.COOKIE_SECRET!,
    });

    if (clientSession.did) {
      await clientSession.destroy();
    }
    clientSession.did = session.did;
    await clientSession.save();
    return  NextResponse.redirect(new URL('/', getUrl()))
  } catch (err) {
    console.error({ err }, "oauth callback failed");
    return  NextResponse.redirect(new URL('/login/?error', getUrl()))
  }
};
