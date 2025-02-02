import { getSessionAgent } from "@/lib/getSessionAgent";
import { NextResponse } from "next/server";
import { TID } from "@atproto/common";
import * as Post from "@/lexicon/types/app/bluepic/post";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getUrl } from "@/lib/getUrl";

export const POST = async (req: Request) => {
  // If the user is signed in, get an agent which communicates with their server
  const agent = await getSessionAgent();
  if (!agent) {
    return NextResponse.json({ error: "Session required" }, { status: 401 });
  }

  // Construct & validate their status record
  const rkey = TID.nextStr();
  const reqData = await req.json();
  const record = {
    $type: "app.bluepic.post",
    imageUrl: reqData.imageUrl,
    caption: reqData.caption,
    userId: agent.assertDid,
    createdAt: new Date().toISOString(),
  };
  const { userId, ...rest } = record;
  const validation = Post.validateRecord(rest)
  if (!validation.success) {
    console.error(validation.error)
    return NextResponse.json({ message: "Invalid post", error: validation.error }, { status: 400 });
  }

  let uri: string = "";
  try {
    // Write the status record to the user's repository
    const res = await agent.com.atproto.repo.putRecord({
      repo: agent.assertDid,
      collection: "app.bluepic.post",
      rkey,
      record,
      validate: false,
    });
    uri = res.data.uri;
  } catch (err) {
    console.error({ err }, "failed to write record");
    return NextResponse.json(
      { error: "Failed to write record" },
      { status: 500 }
    );
  }

  try {
    // Optimistically update our SQLite
    // This isn't strictly necessary because the write event will be
    // handled in #/firehose/ingestor.ts, but it ensures that future reads
    // will be up-to-date after this method finishes.
    const post: typeof posts.$inferInsert = {
      uri,
      userId: agent.assertDid,
      imageUrl: record.imageUrl,
      caption: record.caption,
      createdAt: record.createdAt,
      indexedAt: new Date().toISOString(),
    };

    await db.insert(posts).values(post);
  } catch (err) {
    console.error(
      { err },
      "failed to update computed view; ignoring as it should be caught by the firehose"
    );
  }

  return NextResponse.redirect(new URL('/', getUrl()));
};
