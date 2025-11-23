'use client'

import { useState, useEffect } from 'react'
import { Shield, Check, X, Loader2, Copy, AlertCircle, Mail } from 'lucide-react'

interface TwoFactorSetupProps {
  user: any
}

export default function TwoFactorSetup({ user }: TwoFactorSetupProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [setupMethod, setSetupMethod] = useState<'app' | 'email'>('app')
  const [emailCode, setEmailCode] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  useEffect(() => {
    check2FAStatus()
  }, [])

  const check2FAStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/2fa/setup', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      setIsEnabled(data.enabled || false)
      
      if (data.enabled && data.qrCode) {
        setQrCode(data.qrCode)
        setSecret(data.manualEntryKey)
      }
    } catch (err) {
      console.error('Error checking 2FA status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetup = async () => {
    setIsSettingUp(true)
    setSetupMethod('app')
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setQrCode(data.qrCode)
        setSecret(data.manualEntryKey)
        setIsSettingUp(false)
      } else {
        setError(data.error || 'Failed to set up 2FA')
        setIsSettingUp(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setIsSettingUp(false)
    }
  }

  const handleEmailSetup = async () => {
    setIsSendingEmail(true)
    setSetupMethod('email')
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/2fa/email/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Code sent to your email!')
        // Show code in development
        if (data.code) {
          setSuccess(`Code sent! (Dev: ${data.code})`)
        }
        setIsSendingEmail(false)
        // Clear previous code
        setEmailCode('')
      } else {
        setError(data.error || 'Failed to send email code')
        setIsSendingEmail(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setIsSendingEmail(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        setSuccess('2FA verified and enabled successfully!')
        setIsEnabled(true)
        setVerificationCode('')
        setTimeout(() => {
          check2FAStatus()
        }, 1000)
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleEmailVerify = async () => {
    if (!emailCode || emailCode.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('auth_token')
      const password = prompt('Enter your password to enable email 2FA:')
      if (!password) {
        setIsVerifying(false)
        return
      }

      const response = await fetch('/api/auth/2fa/email/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: emailCode, password }),
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        setSuccess('Email 2FA enabled successfully!')
        setIsEnabled(true)
        setEmailCode('')
        setTimeout(() => {
          check2FAStatus()
        }, 1000)
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDisable = async () => {
    const password = prompt('Enter your password to disable 2FA:')
    if (!password) return

    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('2FA has been disabled')
        setIsEnabled(false)
        setQrCode('')
        setSecret('')
        check2FAStatus()
      } else {
        setError(data.error || 'Failed to disable 2FA')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret)
      setSuccess('Secret key copied to clipboard!')
      setTimeout(() => setSuccess(''), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-blue-400" size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold">Two-Factor Authentication (2FA)</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
          <Check size={20} className="text-green-400" />
          <p className="text-green-200 text-sm">{success}</p>
        </div>
      )}

      {!isEnabled && !qrCode && (
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 mb-6">
              Two-factor authentication adds an extra layer of security to your account. 
              Choose your preferred method:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleSetup}
                disabled={isSettingUp}
                className="p-4 border-2 border-blue-500/50 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all text-left"
              >
                <Shield size={24} className="text-blue-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Authenticator App</h3>
                <p className="text-sm text-gray-400">Use Google Authenticator, Authy, or similar apps</p>
              </button>
              
              <button
                onClick={handleEmailSetup}
                disabled={isSettingUp}
                className="p-4 border-2 border-purple-500/50 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left"
              >
                <Mail size={24} className="text-purple-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Email</h3>
                <p className="text-sm text-gray-400">Receive codes via email</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isEnabled && setupMethod === 'email' && success.includes('sent') && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Enter Email Verification Code</h3>
            <p className="text-sm text-gray-400 mb-4">
              We've sent a 6-digit code to your email. Enter it below to complete setup:
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest font-mono"
              />
              <button
                onClick={handleEmailVerify}
                disabled={emailCode.length !== 6 || isVerifying}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {isVerifying ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Check size={20} />
                    Verify
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handleEmailSetup}
              className="text-sm text-purple-400 hover:text-purple-300 mt-2"
            >
              Resend code
            </button>
          </div>
        </div>
      )}

      {!isEnabled && qrCode && setupMethod === 'app' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Step 1: Scan QR Code</h3>
            <p className="text-sm text-gray-400 mb-4">
              Open your authenticator app and scan this QR code:
            </p>
            <div className="bg-white p-4 rounded-lg inline-block">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Step 2: Manual Entry (Optional)</h3>
            <p className="text-sm text-gray-400 mb-2">
              Or enter this secret key manually:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-2 bg-white/10 rounded-lg font-mono text-sm break-all">
                {secret}
              </code>
              <button
                onClick={copySecret}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Copy secret"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Step 3: Verify Setup</h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter the 6-digit code from your authenticator app to complete setup:
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono"
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying || verificationCode.length !== 6}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {isVerifying ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Check size={20} />
                    Verify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEnabled && (
        <div className="space-y-4">
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check className="text-green-400" size={20} />
              <span className="font-semibold text-green-400">2FA is Enabled</span>
            </div>
            <p className="text-sm text-gray-300">
              Your account is protected with two-factor authentication. 
              You'll need to enter a code from your authenticator app when logging in.
            </p>
          </div>

          {qrCode && (
            <div>
              <h3 className="font-semibold mb-2">Your 2FA QR Code</h3>
              <p className="text-sm text-gray-400 mb-4">
                Save this QR code or secret key to set up 2FA on a new device:
              </p>
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <code className="flex-1 px-4 py-2 bg-white/10 rounded-lg font-mono text-sm break-all">
                  {secret}
                </code>
                <button
                  onClick={copySecret}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy secret"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleDisable}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <X size={20} />
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  )
}

