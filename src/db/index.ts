import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../schemas'

const isDev = process.env.NODE_ENV === 'development'

const globalDb = globalThis as unknown as {
  conn: postgres.Sql | undefined
}

const conn = globalDb.conn ?? postgres(process.env.DATABASE_URL!)

if (isDev) globalDb.conn = conn

export const db = drizzle(conn, {
  schema
})
