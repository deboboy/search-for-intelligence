'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignOutLink() {
  const router = useRouter()

  const handleSignOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    await signOut({ redirect: false })
    router.push('/auth/signin') // Redirect to sign-in page after signing out
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