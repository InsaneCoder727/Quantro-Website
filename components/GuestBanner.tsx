'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function GuestBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const dismissed = localStorage.getItem('guest_banner_dismissed')
    setIsVisible(!token && !dismissed)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('guest_banner_dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30 px-6 py-3 animate-fade-in">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Sparkles className="text-blue-400" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">
              You're viewing as a guest
            </p>
            <p className="text-xs text-gray-300">
              <Link href="/register" className="underline hover:text-white">
                Sign up
              </Link> for free to save your portfolio, watchlist, and access advanced features
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Get Started
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

