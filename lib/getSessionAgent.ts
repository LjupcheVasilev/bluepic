import { Session } from "@/app/api/auth/types";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { getClient } from "./oauthClient";
import { Agent } from "@atproto/api";

export async function getSessionAgent() {
  const session = await getIronSession<Session>(await cookies(), {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });
  if (!session.did) return null;
  try {
    const oauthClient = await getClient()
    const oauthSession = await oauthClient.restore(session.did);
    return oauthSession ? new Agent(oauthSession) : null;
  } catch (err) {
    console.error({ err }, "oauth restore failed");
    await session.destroy();
    return null;
  }
}
