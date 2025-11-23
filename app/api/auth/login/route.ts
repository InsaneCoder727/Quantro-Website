import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, comparePassword, generateToken, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, twoFactorCode } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await getUserByEmail(email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      if (!twoFactorCode) {
        // Don't force a method - let user choose
        // Check if user has a preferred method set
        const userRecord = await getUserByEmail(email.toLowerCase())
        const preferredMethod = (userRecord as any)?.two_factor_method
        
        return NextResponse.json(
          { 
            requires2FA: true,
            message: 'Two-factor authentication required. Choose your verification method.',
            preferredMethod: preferredMethod || null, // Suggest their preferred method if set
          },
          { status: 200 }
        )
      }

      // Verify 2FA code - try both methods
      const userRecord = await getUserByEmail(email.toLowerCase())
      const preferredMethod = (userRecord as any)?.two_factor_method

      let isValid = false

      // Try email first (if email method is set) or try both
      if (!preferredMethod || preferredMethod === 'email') {
        const { verifyEmailCode } = await import('@/lib/email-codes')
        const result = verifyEmailCode(user.email, twoFactorCode)
        if (result.valid) {
          isValid = true
        }
      }

      // Try TOTP if email didn't work or if app method is set
      if (!isValid && (preferredMethod === 'app' || !preferredMethod)) {
        if (user.two_factor_secret) {
          const speakeasy = await import('speakeasy')
          const totpValid = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token: twoFactorCode,
            window: 2, // Allow 2 time steps before/after
          })
          if (totpValid) {
            isValid = true
          }
        }
      }

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid two-factor authentication code' },
          { status: 401 }
        )
      }
    }

    // Generate token
    const token = generateToken(user.id, user.email)

    // Create session
    await createSession(user.id, token)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        two_factor_enabled: user.two_factor_enabled,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
