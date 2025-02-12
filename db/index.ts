import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString, {
    ssl: { rejectUnauthorized: false },
    prepare: false
})
export const db = drizzle(client)

export type Database = typeof db