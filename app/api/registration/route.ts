import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password, secret } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine if this is an admin creation
    const isAdminCreation = secret === process.env.ADMIN_CREATION_SECRET

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: isAdminCreation ? 'admin' : 'user', // Set role based on secret
      },
      select: {
        id: true,
        email: true,
        role: true,
        // Don't select the password
      }
    })

    return NextResponse.json({ 
      message: isAdminCreation ? 'Admin user created successfully' : 'User created successfully', 
      user 
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 })
  }
}