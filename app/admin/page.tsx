'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  accessToken?: string
}

interface NewUser {
  name: string
  email: string
  password: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<NewUser>({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession() as { data: { user: User } | null, status: string }
  const router = useRouter()

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)

    if (status === 'loading') return // wait for the session to load
    if (!session) {
      console.log('No session, redirecting to home')
      router.push('/')
    } else if (session.user?.role !== 'admin') {
      console.log('User is not admin, redirecting to home')
      router.push('/')
    } else {
      console.log('User is admin, staying on page')
      fetchUsers()
    }
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...')
      const response = await fetch('/api/users')
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched users:', data)
        setUsers(data)
      } else {
        const errorData = await response.json()
        console.error('Error fetching users:', errorData)
        setError(errorData.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('An error occurred while fetching users')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.accessToken || ''}` // If you're using access tokens
        },
        body: JSON.stringify(newUser)
      })
      if (response.ok) {
        setNewUser({ name: '', email: '', password: '' }) // Reset form
        fetchUsers() // Refresh user list
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setError('An error occurred while creating the user')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user?.role !== 'admin') {
    return <div>Redirecting...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Administration</h1>
        <p>Current user: {session.user?.name || session.user?.email}</p>
        <p>Role: {session.user?.role}</p>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      <form onSubmit={handleCreateUser} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create New User</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create User
          </button>
        </div>
      </form>
        <h2 className="text-xl font-semibold mb-2">Current Users</h2>
        <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
    </div>
  )
}