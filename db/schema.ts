import {
  pgTable,
  varchar,
  timestamp,
  text,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const authState = pgTable("auth_state", {
  key: varchar("key", { length: 255 }).primaryKey(),
  state: varchar("state", { length: 1024 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authSession = pgTable("auth_session", {
  key: varchar("key", { length: 255 }).primaryKey(),
  session: varchar("session", { length: 2048 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  did: varchar("did", { length: 255 }).primaryKey().notNull(),
  handle: varchar("handle", { length: 255 }).unique().notNull(),
  displayName: varchar("display_name", { length: 255 }),
  avatarLink: text("avatar_link"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const posts = pgTable("posts", {
  uri: varchar("uri", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.did),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  createdAt: varchar("created_at", { length: 30 }).notNull(),
  indexedAt: varchar("updated_at", { length: 30 }).notNull(),
});
