import NextAuth, { AuthOptions } from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: [],
  // Add any other options you need here
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)