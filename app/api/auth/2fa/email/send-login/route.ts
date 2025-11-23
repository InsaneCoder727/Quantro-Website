import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await getUserByEmail(email.toLowerCase())

    if (!user || !user.two_factor_enabled) {
      return NextResponse.json(
        { error: 'User not found or 2FA not enabled' },
        { status: 404 }
      )
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

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

