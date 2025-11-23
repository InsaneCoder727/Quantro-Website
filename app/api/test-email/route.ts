import { NextRequest, NextResponse } from 'next/server'
import { send2FACode } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Test with a random code
    const testCode = '123456'
    const emailSent = await send2FACode(email, testCode)

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent 
        ? 'Test email sent successfully! Check your inbox.' 
        : 'Email not sent. Check console for details. Make sure SMTP is configured in .env.local',
      code: testCode,
      smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

