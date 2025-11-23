import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'
import speakeasy from 'speakeasy'

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

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    const user = await getUserById(decoded.userId)

    if (!user || !user.two_factor_enabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      )
    }

    const { getUserByEmail } = await import('@/lib/auth')
    const userRecord = await getUserByEmail(user.email)

    if (!userRecord?.two_factor_secret) {
      return NextResponse.json(
        { error: '2FA secret not found' },
        { status: 400 }
      )
    }

    // Verify the code
    const isValid = speakeasy.totp.verify({
      secret: userRecord.two_factor_secret,
      encoding: 'base32',
      token: code,
      window: 2,
    })

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      verified: true,
      message: '2FA verified successfully',
    })
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

