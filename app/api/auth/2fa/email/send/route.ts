import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'

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

    const user = await getUserById(decoded.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Code expires in 10 minutes

    // Store code
    const { storeEmailCode } = await import('@/lib/email-codes')
    storeEmailCode(user.email, code, user.id, 10)

    // Send email using Resend (or log in development if not configured)
    const { send2FACode } = await import('@/lib/email')
    const emailSent = await send2FACode(user.email, code)
    
    // In development without SMTP configured, still return code for testing
    const isDevelopment = process.env.NODE_ENV === 'development'
    const hasSMTP = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD)

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? '2FA code sent to your email' 
        : '2FA code generated (check console for code or configure SMTP in .env.local)',
      // In development without SMTP, return code for testing
      ...(isDevelopment && !hasSMTP && { code }),
      emailSent,
    })
  } catch (error) {
    console.error('2FA email send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

