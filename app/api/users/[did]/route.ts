import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (
  req: Request,
  { params }: { params: { did: string } }
) => {
  try {
    const { did } = await params;

    const user = await db
      .select({
        did: users.did,
        handle: users.handle,
        displayName: users.displayName,
        avatarLink: users.avatarLink,
        description: users.description,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.did, did))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};