import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname)

  // Paths that should be accessible without authentication
  const publicPaths = ['/', '/about', '/auth/signin', '/api/auth']
  
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    console.log('Public path accessed')
    return NextResponse.next()
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  console.log('Token found:', !!token)

  if (!token) {
    console.log('No token, redirecting to signin')
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(signInUrl)
  }

  console.log('Token verified successfully')
  return NextResponse.next()
}

// Keep your existing config
export const config = {
  matcher: [
    '/advanced-setup/:path*',
    '/advanced-run/:path*',
    '/advanced-scoring/:path*',
    '/advanced-results/:path*'
    // Add other protected routes here
  ]
}