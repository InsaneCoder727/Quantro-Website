'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, User, Clock } from 'lucide-react'
import Link from 'next/link'
import NotificationDropdown from './NotificationDropdown'

interface User {
  name: string
  email: string
}

export default function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setUser(JSON.parse(userStr))
      } else {
        setUser(null)
      }
    }
    
    checkUser()

    // Update time every second for smooth clock
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkUser)
    const interval = setInterval(checkUser, 1000) // Check every second for immediate updates

    return () => {
      clearInterval(timer)
      clearInterval(interval)
      window.removeEventListener('storage', checkUser)
    }
  }, [])

  // Check for unread notifications
  useEffect(() => {
    const checkNotifications = () => {
      const saved = localStorage.getItem('notifications')
      if (saved) {
        const notifications = JSON.parse(saved)
        const unread = notifications.filter((n: any) => !n.read).length
        setUnreadCount(unread)
      }
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 5000)
    return () => clearInterval(interval)
  }, [notificationsOpen])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-white">
                {user ? (
                  <>
                    Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">{user.name.split(' ')[0]}</span>
                  </>
                ) : (
                  <>
                    Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quantro</span>
                  </>
                )}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={14} className="animate-spin-slow" />
                  <span className="font-mono">{formatTime(currentTime)}</span>
                </div>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
              />
            </div>

            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 hover:bg-white/10 rounded-lg transition-all group"
                  >
                    <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                  </button>
                  <NotificationDropdown 
                    isOpen={notificationsOpen} 
                    onClose={() => setNotificationsOpen(false)} 
                  />
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

