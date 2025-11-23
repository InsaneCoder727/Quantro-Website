import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as db from './db-simple'

const JWT_SECRET = process.env.JWT_SECRET || 'quantro-secret-key-change-in-production-min-32-chars'
const JWT_EXPIRES_IN = '7d'

export interface User {
  id: string
  email: string
  name: string
  two_factor_enabled: boolean
  email_verified: boolean
}

export interface UserRecord extends User {
  password_hash: string
  two_factor_secret?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function createUser(email: string, name: string, passwordHash: string): Promise<User> {
  const newUser = await db.createUser(email, name, passwordHash)
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    two_factor_enabled: newUser.two_factor_enabled,
    email_verified: newUser.email_verified,
  }
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  return db.getUserByEmail(email)
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await db.getUserById(id)
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    two_factor_enabled: user.two_factor_enabled,
    email_verified: user.email_verified,
  }
}

export async function enable2FA(userId: string, secret: string): Promise<void> {
  return db.enable2FA(userId, secret)
}

export async function disable2FA(userId: string): Promise<void> {
  return db.disable2FA(userId)
}

export async function createSession(userId: string, token: string): Promise<void> {
  return db.createSession(userId, token)
}

export async function deleteSession(token: string): Promise<void> {
  return db.deleteSession(token)
}

export async function verifySession(token: string): Promise<boolean> {
  return db.verifySession(token)
}
