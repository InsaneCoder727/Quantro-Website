'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle cx="50" cy="50" r="48" fill="url(#gradient)" />
          
          {/* Q Letter */}
          <path
            d="M 30 20 L 30 70 L 50 70 L 50 60 L 60 60 L 60 50 L 50 50 L 50 30 L 40 30 L 40 50 L 30 50 Z"
            fill="white"
          />
          {/* Q Tail */}
          <path
            d="M 50 60 L 62 72 L 55 75 L 50 68 Z"
            fill="white"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span
          className={`${textSizes[size]} font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}
        >
          Quantro
        </span>
      )}
    </div>
  )
}

