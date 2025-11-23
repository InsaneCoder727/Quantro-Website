// Simple storage for email 2FA codes
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const dbDir = join(process.cwd(), 'database')
const codesPath = join(dbDir, 'email-codes.json')

// Ensure database directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

interface EmailCode {
  code: string
  expiresAt: string
  userId: string
}

function readCodes(): Record<string, EmailCode> {
  if (!existsSync(codesPath)) {
    return {}
  }
  try {
    const codes = JSON.parse(readFileSync(codesPath, 'utf-8'))
    // Clean expired codes
    const now = new Date().toISOString()
    const validCodes: Record<string, EmailCode> = {}
    for (const [email, code] of Object.entries(codes)) {
      if ((code as EmailCode).expiresAt > now) {
        validCodes[email] = code as EmailCode
      }
    }
    if (Object.keys(validCodes).length !== Object.keys(codes).length) {
      writeCodes(validCodes)
    }
    return validCodes
  } catch {
    return {}
  }
}

function writeCodes(codes: Record<string, EmailCode>) {
  writeFileSync(codesPath, JSON.stringify(codes, null, 2))
}

export function storeEmailCode(email: string, code: string, userId: string, expiresInMinutes: number = 10) {
  const codes = readCodes()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes)

  codes[email.toLowerCase()] = {
    code,
    expiresAt: expiresAt.toISOString(),
    userId,
  }
  writeCodes(codes)
}

export function verifyEmailCode(email: string, code: string): { valid: boolean; userId?: string } {
  const codes = readCodes()
  const stored = codes[email.toLowerCase()]

  if (!stored) {
    return { valid: false }
  }

  // Check if expired
  if (new Date(stored.expiresAt) < new Date()) {
    delete codes[email.toLowerCase()]
    writeCodes(codes)
    return { valid: false }
  }

  // Verify code
  if (stored.code !== code) {
    return { valid: false }
  }

  // Code is valid, delete it
  delete codes[email.toLowerCase()]
  writeCodes(codes)

  return { valid: true, userId: stored.userId }
}

export function deleteEmailCode(email: string) {
  const codes = readCodes()
  delete codes[email.toLowerCase()]
  writeCodes(codes)
}

