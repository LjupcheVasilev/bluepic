import { 
  pgTable, 
  varchar, 
  timestamp, 
  text,
  uuid, 
  boolean
} from 'drizzle-orm/pg-core'

export const authState = pgTable('auth_state', {
  key: varchar('key', { length: 255 }).primaryKey(),
  state: varchar('state', { length: 1024 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const authSession = pgTable('auth_session', {
  key: varchar('key', { length: 255 }).primaryKey(),
  session: varchar('session', { length: 2048 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const posts = pgTable('posts', {
  uri: varchar('uri', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  createdAt: varchar('created_at', { length: 30 }).notNull(),
  indexedAt: varchar('updated_at', { length: 30}).notNull()
})

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    did: varchar('did', { length: 255 }).unique().notNull(),
    handle: varchar('handle', { length: 255 }).unique().notNull(),
    displayName: varchar('display_name', { length: 255 }),
    avatar: text('avatar'),
    bio: text('bio'),
    email: varchar('email', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastLogin: timestamp('last_login'),
    isActive: boolean('is_active').default(true).notNull()
  })