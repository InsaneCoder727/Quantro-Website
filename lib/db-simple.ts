// Simple file-based database using JSON for reliability
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const dbDir = join(process.cwd(), 'database')
const dbPath = join(dbDir, 'users.json')
const sessionsPath = join(dbDir, 'sessions.json')

// Ensure database directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

interface UserRecord {
  id: string
  email: string
  name: string
  password_hash: string
  two_factor_secret?: string
  two_factor_enabled: boolean
  two_factor_method?: 'app' | 'email'
  email_verified: boolean
  created_at: string
  updated_at: string
}

interface SessionRecord {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}

function readUsers(): UserRecord[] {
  if (!existsSync(dbPath)) {
    return []
  }
  try {
    return JSON.parse(readFileSync(dbPath, 'utf-8'))
  } catch {
    return []
  }
}

function writeUsers(users: UserRecord[]) {
  writeFileSync(dbPath, JSON.stringify(users, null, 2))
}

function readSessions(): SessionRecord[] {
  if (!existsSync(sessionsPath)) {
    return []
  }
  try {
    const sessions = JSON.parse(readFileSync(sessionsPath, 'utf-8'))
    // Clean expired sessions
    const now = new Date().toISOString()
    const validSessions = sessions.filter((s: SessionRecord) => s.expires_at > now)
    if (validSessions.length !== sessions.length) {
      writeSessions(validSessions)
    }
    return validSessions
  } catch {
    return []
  }
}

function writeSessions(sessions: SessionRecord[]) {
  writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2))
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const users = readUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const users = readUsers()
  return users.find(u => u.id === id) || null
}

export async function createUser(email: string, name: string, passwordHash: string): Promise<UserRecord> {
  const users = readUsers()
  const uuid = await import('uuid')
  const id = uuid.v4()
  const now = new Date().toISOString()

  const newUser: UserRecord = {
    id,
    email: email.toLowerCase(),
    name,
    password_hash: passwordHash,
    two_factor_enabled: false,
    email_verified: false,
    created_at: now,
    updated_at: now,
  }

  users.push(newUser)
  writeUsers(users)
  return newUser
}

export async function enable2FA(userId: string, secret: string, method: 'app' | 'email' = 'app'): Promise<void> {
  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex >= 0) {
    users[userIndex].two_factor_secret = secret
    users[userIndex].two_factor_enabled = true
    users[userIndex].two_factor_method = method
    users[userIndex].updated_at = new Date().toISOString()
    writeUsers(users)
  }
}

export async function enableEmail2FA(userId: string): Promise<void> {
  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex >= 0) {
    users[userIndex].two_factor_enabled = true
    users[userIndex].two_factor_method = 'email'
    users[userIndex].updated_at = new Date().toISOString()
    writeUsers(users)
  }
}

export async function disable2FA(userId: string): Promise<void> {
  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex >= 0) {
    users[userIndex].two_factor_secret = undefined
    users[userIndex].two_factor_enabled = false
    users[userIndex].updated_at = new Date().toISOString()
    writeUsers(users)
  }
}

export async function createSession(userId: string, token: string): Promise<void> {
  const sessions = readSessions()
  const uuid = await import('uuid')
  const sessionId = uuid.v4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  sessions.push({
    id: sessionId,
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  })
  writeSessions(sessions)
}

export async function deleteSession(token: string): Promise<void> {
  const sessions = readSessions()
  const filtered = sessions.filter(s => s.token !== token)
  writeSessions(filtered)
}

export async function verifySession(token: string): Promise<boolean> {
  const sessions = readSessions()
  const now = new Date().toISOString()
  return sessions.some(s => s.token === token && s.expires_at > now)
}

