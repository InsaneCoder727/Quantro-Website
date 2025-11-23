import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, getUserByEmail, comparePassword } from '@/lib/auth'
import * as db from '@/lib/db-simple'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { code, password } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    const user = await getUserById(decoded.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify code
    const { verifyEmailCode } = await import('@/lib/email-codes')
    const result = verifyEmailCode(user.email, code)

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please request a new one.' },
        { status: 401 }
      )
    }

    // If password provided (for enabling 2FA), verify it
    if (password) {
      const userRecord = await getUserByEmail(user.email)
      if (!userRecord) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const isPasswordValid = await comparePassword(password, userRecord.password_hash)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        )
      }

      // Enable email 2FA
      await db.enableEmail2FA(user.id)
    }

    return NextResponse.json({
      verified: true,
      message: password ? 'Email 2FA enabled successfully' : 'Code verified successfully',
    })
  } catch (error) {
    console.error('2FA email verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

