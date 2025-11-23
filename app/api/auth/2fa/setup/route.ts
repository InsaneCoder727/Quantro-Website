import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById, enable2FA } from '@/lib/auth'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

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

    if (user.two_factor_enabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      )
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Quantro (${user.email})`,
      issuer: 'Quantro',
      length: 32,
    })

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    // Store the secret (will be enabled after verification)
    await enable2FA(user.id, secret.base32!)

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    if (!user.two_factor_enabled) {
      return NextResponse.json({
        enabled: false,
      })
    }

    // Get secret to generate QR code again
    const { getUserByEmail } = await import('@/lib/auth')
    const userRecord = await getUserByEmail(user.email)

    if (!userRecord?.two_factor_secret) {
      return NextResponse.json({
        enabled: false,
      })
    }

    const secret = {
      base32: userRecord.two_factor_secret,
      otpauth_url: speakeasy.otpauthURL({
        secret: userRecord.two_factor_secret,
        label: `Quantro (${user.email})`,
        issuer: 'Quantro',
        encoding: 'base32',
      }),
    }

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    return NextResponse.json({
      enabled: true,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    })
  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

