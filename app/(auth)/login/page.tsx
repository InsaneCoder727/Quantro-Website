'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Mail, Lock, AlertCircle, Shield, Smartphone } from 'lucide-react'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [requires2FA, setRequires2FA] = useState(false)
  const [twoFAMethod, setTwoFAMethod] = useState<'app' | 'email' | null>(null)
  const [showMethodChoice, setShowMethodChoice] = useState(false)
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          twoFactorCode: formData.twoFactorCode || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Check if 2FA is required
        if (data.requires2FA) {
          setRequires2FA(true)
          // Always show method choice - let user choose
          setShowMethodChoice(true)
          setTwoFAMethod(null)
          setError(data.message || '')
          setIsLoading(false)
          
          // Store token temporarily for email code request
          if (!localStorage.getItem('auth_token')) {
            // We need a temporary token - but since 2FA is required, we can't create one yet
            // For now, we'll handle it differently
          }
          
          return
        }

        // Check if login was successful
        if (data.token && data.user) {
          // Store token
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Redirect to dashboard
          router.push('/dashboard')
          return
        }
      }

      // Handle errors
      setError(data.error || 'Login failed. Please check your credentials.')
      setRequires2FA(false)
    } catch (err) {
      setError('Network error. Please try again.')
      setRequires2FA(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FAMethodChoice = async (method: 'app' | 'email') => {
    setTwoFAMethod(method)
    setShowMethodChoice(false)
    setError('')
    
    if (method === 'email') {
      setIsSendingEmailCode(true)
      try {
        // Send email code using email (no auth required for this endpoint)
        const response = await fetch('/api/auth/2fa/email/send-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setError('Code sent to your email!')
          // Show code in development
          if (data.code) {
            setError(`Code sent! (Dev: ${data.code})`)
          }
        } else {
          setError(data.error || 'Failed to send email code')
        }
      } catch (err) {
        setError('Failed to send email code. Please try again.')
      } finally {
        setIsSendingEmailCode(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={true} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {requires2FA && showMethodChoice && (
            <div className="mb-6 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-blue-400" />
                <p className="text-blue-200 font-semibold">Choose 2FA Method</p>
              </div>
              <p className="text-blue-200 text-sm mb-4">
                Select how you'd like to verify your identity:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handle2FAMethodChoice('app')}
                  disabled={isSendingEmailCode}
                  className="p-4 border-2 border-blue-500/50 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Smartphone size={24} className="text-blue-400" />
                    <h4 className="font-semibold text-white">Authenticator App</h4>
                  </div>
                  <p className="text-xs text-gray-300">Use Google Authenticator, Authy, or similar apps</p>
                </button>
                
                <button
                  onClick={() => handle2FAMethodChoice('email')}
                  disabled={isSendingEmailCode}
                  className="p-4 border-2 border-purple-500/50 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={24} className="text-purple-400" />
                    <h4 className="font-semibold text-white">Email</h4>
                  </div>
                  <p className="text-xs text-gray-300">Receive a 6-digit code via email</p>
                </button>
              </div>
              {isSendingEmailCode && (
                <div className="mt-4 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-blue-200 text-xs mt-2">Sending code to your email...</p>
                </div>
              )}
            </div>
          )}

          {requires2FA && !showMethodChoice && twoFAMethod && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} className="text-blue-400" />
                <p className="text-blue-200 font-semibold">Two-Factor Authentication Required</p>
              </div>
              <p className="text-blue-200 text-sm">
                {twoFAMethod === 'email' 
                  ? 'Please enter the 6-digit code sent to your email'
                  : 'Please enter the 6-digit code from your authenticator app'}
              </p>
              {twoFAMethod === 'email' && (
                <button
                  onClick={() => handle2FAMethodChoice('email')}
                  className="text-xs text-blue-300 hover:text-blue-200 mt-2"
                >
                  Resend code
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!requires2FA ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-300 mb-2">
                  2FA Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="twoFactorCode"
                    required
                    maxLength={6}
                    value={formData.twoFactorCode}
                    onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, '') })}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  {twoFAMethod === 'email'
                    ? 'Enter the 6-digit code sent to your email'
                    : 'Enter the 6-digit code from your authenticator app'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || showMethodChoice || isSendingEmailCode}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {requires2FA ? 'Verifying...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {requires2FA && !showMethodChoice ? <Shield size={20} /> : <LogIn size={20} />}
                  {requires2FA && !showMethodChoice ? 'Verify & Sign In' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
