import { getIronSession } from "iron-session";
import { Session } from "../auth/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getIronSession<Session>(await cookies(), {
    cookieName: "sid",
    password: process.env.COOKIE_SECRET!,
  });

  return NextResponse.json(session);
};
