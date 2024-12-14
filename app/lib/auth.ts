import { AuthOptions, DefaultSession, User as NextAuthUser } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"  // Add this import

// Update the User type
type User = NextAuthUser & {
    id: string;
    email: string;
    name: string | null;
    role: string;
};

declare module "next-auth" {
    interface Session extends DefaultSession {
      user?: {
        id: string;
        role: string;
      } & DefaultSession["user"]
    }
}

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = (user as User).role || 'user';
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string
          session.user.role = token.role as string
        }
        return session
    }
  }
}

export async function auth() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    throw new Error('Unauthorized')
  }
}