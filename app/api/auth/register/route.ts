import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: string
  name: string
  email: string
}

// Mock user storage (in production, use a database)
const users: Array<{ email: string; password: string; user: User }> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists (in production, check database)
    const existingUser = users.find(u => u.email === email)
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user (in production, hash password and save to database)
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name,
      email: email,
    }

    users.push({
      email,
      password, // In production, store hashed password
      user: newUser,
    })

    const token = Buffer.from(JSON.stringify({ email, userId: newUser.id })).toString('base64')

    return NextResponse.json({
      token,
      user: newUser,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

