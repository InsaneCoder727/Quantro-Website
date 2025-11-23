# Authentication System Setup

Quantro now has a fully functional authentication system with 2FA support!

## Features

✅ **Real User Accounts**
- Email and password registration
- Password hashing with bcrypt
- User database storage
- Email validation

✅ **Secure Login**
- Password verification
- JWT token generation
- Session management
- 7-day token expiration

✅ **Two-Factor Authentication (2FA)**
- TOTP (Time-based One-Time Password) support
- QR code generation for authenticator apps
- Manual entry key for setup
- Required on login when enabled
- Can be enabled/disabled in Settings

## How It Works

### Registration
1. User enters name, email, and password
2. Email is validated
3. Password is hashed using bcrypt
4. User record is created in database
5. JWT token is generated and session is created
6. User is automatically logged in

### Login
1. User enters email and password
2. Password is verified against hash
3. If 2FA is enabled:
   - User is prompted for 6-digit code
   - Code is verified using TOTP
4. JWT token is generated on success
5. Session is created and stored

### 2FA Setup
1. Go to Settings page
2. Click "Enable 2FA"
3. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
4. Enter verification code to complete setup
5. 2FA is now required for all future logins

## Database

The system uses a simple JSON-based database stored in `/database/`:
- `users.json` - User accounts and 2FA secrets
- `sessions.json` - Active login sessions

**Note:** For production, consider migrating to PostgreSQL or another production database.

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production (set via environment variable)
2. **Password Requirements**: Minimum 8 characters (enforced on registration)
3. **2FA**: Optional but recommended for enhanced security
4. **Sessions**: Automatically expire after 7 days
5. **Password Hashing**: Uses bcrypt with 10 salt rounds

## Environment Variables

Create a `.env.local` file:

```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

## Testing

1. Register a new account with email and password
2. Login with your credentials
3. Enable 2FA in Settings
4. Logout and login again - you'll be prompted for 2FA code
5. Enter the code from your authenticator app

## Files Created/Modified

- `lib/db-simple.ts` - Simple JSON-based database
- `lib/auth.ts` - Authentication utilities (hashing, tokens, 2FA)
- `app/api/auth/register/route.ts` - Registration endpoint
- `app/api/auth/login/route.ts` - Login endpoint with 2FA
- `app/api/auth/2fa/setup/route.ts` - 2FA setup endpoint
- `app/api/auth/2fa/verify/route.ts` - 2FA verification endpoint
- `app/api/auth/2fa/disable/route.ts` - 2FA disable endpoint
- `app/(auth)/login/page.tsx` - Updated login page with 2FA support
- `app/(auth)/register/page.tsx` - Updated registration page
- `components/TwoFactorSetup.tsx` - 2FA management component
- `components/SettingsPage.tsx` - Added 2FA section

