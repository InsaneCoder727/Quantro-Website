'use client'

import { Lock, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface AuthPromptProps {
  feature: string
  description?: string
}

export default function AuthPrompt({ feature, description }: AuthPromptProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="card max-w-md text-center animate-fade-in-up">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            <Lock size={40} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-400 mb-1">
            You need to sign in to access {feature}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <UserPlus size={20} />
            Create Account
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Don't worry, it only takes a minute!
        </p>
      </div>
    </div>
  )
}

