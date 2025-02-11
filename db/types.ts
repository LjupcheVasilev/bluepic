import { authSession, authState, posts, users, likes } from './schema'

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export type PostWithUser = Post & {
    user: typeof users.$inferSelect
}

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Session = typeof authSession.$inferSelect
export type NewSession = typeof authSession.$inferInsert

export type AuthState = typeof authState.$inferSelect
export type NewAuthState = typeof authState.$inferInsert

export type Like = typeof likes.$inferSelect
export type NewLike = typeof likes.$inferInsert
export type LikeWithUserAndPost = Like & {
    post: Post,
    user: User
}
