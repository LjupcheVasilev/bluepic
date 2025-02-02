import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { Session } from "../types";
import { getUrl } from "@/lib/getUrl";
import { getClient } from "@/lib/oauthClient";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionAgent } from "@/lib/getSessionAgent";
import { resolveDidToHandle } from "@/lib/biDirectionalResolver";
import { createIdResolver } from "@/lib/createIngester";

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

    const user = await db
      .select()
      .from(users)
      .where(eq(users.did, session.did));

    await clientSession.save();

    const agent = await getSessionAgent();
    const bskyProfile = await agent?.app.bsky.actor.profile.get({
      repo: agent.assertDid,
      rkey: 'self',
    });

    console.log(bskyProfile);
    console.log(bskyProfile?.value);

    const handle = await resolveDidToHandle(createIdResolver(), session.did);
    const userObj: typeof users.$inferInsert = {
      did: session.did,
      displayName: bskyProfile?.value.displayName,
      avatarLink: JSON.stringify(bskyProfile?.value.avatar || ''),
      description: bskyProfile?.value.description,
      handle: handle,
    };

    if (!user.length) {
      await db.insert(users).values(userObj);
    } else {
      await db.update(users).set(userObj).where(eq(users.did, session.did));
    }

    return NextResponse.redirect(new URL("/", getUrl()));
  } catch (err) {
    console.error({ err }, "oauth callback failed");
    return NextResponse.redirect(new URL("/login/?error", getUrl()));
  }
};
