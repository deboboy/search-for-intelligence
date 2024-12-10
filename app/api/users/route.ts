import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/app/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  console.log('Session in /api/users:', session)
  
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { name, email, password } = await request.json()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user', // Default to 'user' role for new users
      },
    })
    return NextResponse.json({ id: user.id, name: user.name, email: user.email })
  } catch (error) {
    console.error('Error in /api/users:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}