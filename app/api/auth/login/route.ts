import { NextRequest, NextResponse } from 'next/server'

// In production, use a real database and proper authentication
// This is a demo implementation

interface User {
  id: string
  name: string
  email: string
}

// Mock user storage (in production, use a database)
const users: Array<{ email: string; password: string; user: User }> = []

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user (in production, check database)
    const userRecord = users.find(u => u.email === email && u.password === password)

    if (!userRecord) {
      // For demo purposes, accept any login
      // In production, validate against database with hashed passwords
      const demoUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
      }

      const token = Buffer.from(JSON.stringify({ email, userId: demoUser.id })).toString('base64')

      return NextResponse.json({
        token,
        user: demoUser,
      })
    }

    // Existing user
    const token = Buffer.from(JSON.stringify({ email, userId: userRecord.user.id })).toString('base64')

    return NextResponse.json({
      token,
      user: userRecord.user,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

