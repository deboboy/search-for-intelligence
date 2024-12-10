'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session:', session)
      if (session?.user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Redirection is handled in the useEffect hook
      }
    } catch (error) {
      console.error('SignIn error:', error)
      setError('An error occurred. Please try again.')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'authenticated') {
    return <div>Redirecting...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Advanced Signin</CardTitle>
        <CardDescription className="text-center">Signin to run advanced experiments</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
            <div className="space-y-2">
              <Label htmlFor="email-address">Email</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Signin'}
            </Button>
        </form>
        <div className="flex justify-center mt-4">
          Need a demo account? &nbsp;
          <Link href="/request" passHref className="hover:underline">
            Request access
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}