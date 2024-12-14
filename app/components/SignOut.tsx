'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function SignOutLink() {
  const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <Link
      href="#"
      onClick={handleSignOut}
      className="text-sm font-medium leading-none"
    >
      Sign out
    </Link>
  )
}