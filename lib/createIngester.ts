import pino from "pino"
import { IdResolver, MemoryCache } from "@atproto/identity"
import { Firehose } from "@atproto/sync"
import type { Database } from "@/db"
import * as Post from "@/lexicon/types/app/bluepic/feed/post"
import { posts } from "@/db/schema"
import { eq } from "drizzle-orm"

const HOUR = 60e3 * 60
const DAY = HOUR * 24


export function createIdResolver() {
  return new IdResolver({
    didCache: new MemoryCache(HOUR, DAY),
  })
}

export function createIngester(db: Database, idResolver: IdResolver) {
  const logger = pino({ name: "firehose ingestion" })
  return new Firehose({
    idResolver,
    handleEvent: async (evt) => {
      logger.info({ event: evt.event, uri: evt.event.toString() })
      // Watch for write events
      if (evt.event === "create" || evt.event === "update") {
        const now = new Date()
        const record = evt.record

        // If the write is a valid status update
        if (
          evt.collection === "app.bluepic.feed.post" &&
          Post.isRecord(record) &&
          Post.validateRecord(record).success
        ) {
          // Store the status in our DB
          await db
            .insert(posts)
            .values({
              uri: evt.uri.toString(),
              userId: evt.did,
              imageUrl: record.imageUrl,
              caption: record.caption,
              createdAt: record.createdAt,
              indexedAt: now.toISOString(),
            })
            .onConflictDoUpdate({
              target: posts.uri,
              set: {
                imageUrl: record.imageUrl,
                caption: record.caption,
                createdAt: record.createdAt,
                indexedAt: now.toISOString(),
              },
              where: eq(posts.uri, evt.uri.toString()),
            })
        }
      } else if (
        evt.event === "delete" &&
        evt.collection === "app.bluepic.feed.post"
      ) {
        // Remove the status from our DB
        await db.delete(posts).where(eq(posts.uri, evt.uri.toString()))
      }
    },
    onError: (err) => {
      logger.error({ err }, "error on firehose ingestion")
    },
    filterCollections: ["app.bluepic.feed.post"],
    excludeIdentity: true,
    excludeAccount: true,
  })
}
