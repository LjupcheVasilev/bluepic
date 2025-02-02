import { getIronSession } from "iron-session";
import { Session } from "../types";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { authSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUrl } from "@/lib/getUrl";

export const GET = async (req: Request) => {
  const session = await getIronSession<Session>(await cookies(), {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });

  const did = session.did
  await session.destroy();

  if (did) {
    await db.delete(authSession).where(eq(authSession.key, did));
  }

  return NextResponse.redirect(new URL("/", getUrl()));
};
