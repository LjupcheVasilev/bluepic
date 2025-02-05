import { db } from "@/db";
import { posts } from "@/db/schema";
import { isRecord } from "@/lexicon/types/app/bluepic/feed/post";
import { getSessionAgent } from "@/lib/getSessionAgent";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const agent = await getSessionAgent();
    if (!agent) {
      return NextResponse.json({ error: "Session required" }, { status: 401 });
    }

    const response = await agent.com.atproto.repo.listRecords({
      repo: agent.assertDid,
      collection: "app.bluepic.feed.post",
      limit: 50,
    });

    for (const record of response.data.records) {
      if (!isRecord(record.value)) {
        console.error("Bad record", record);
        continue;
      }
      const now = new Date();
      // Store the status in our SQLite

      const obj = {
        uri: record.uri,
        userId: record.value.userId,
        imageUrl: record.value.imageUrl,
        caption: record.value.caption,
        createdAt: record.value.createdAt,
        indexedAt: now.toISOString(),
      };

      const upsertObj = {
        imageUrl: record.value.imageUrl,
        caption: record.value.caption,
        createdAt: record.value.createdAt,
        indexedAt: now.toISOString(),
      };

      await db
        .insert(posts)
        .values(obj)
        .onConflictDoUpdate({
          target: posts.uri,
          set: upsertObj,
          targetWhere: eq(posts.uri, record.uri),
        });
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error({ err }, "Failed to list records");
    return NextResponse.json(
      { error: "Failed to list records" },
      { status: 500 }
    );
  }
};
