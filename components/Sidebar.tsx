'use client'

import { Home, TrendingUp, AlertTriangle, BarChart3, Briefcase, Star, Newspaper, Menu, X, LogOut, Brain, Grid, GitCompare, Bell, Settings, Filter, Calendar, LogIn, UserPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from './Logo'

type Tab = 'overview' | 'pump-dump' | 'charts' | 'portfolio' | 'watchlist' | 'news' | 'sentiment' | 'heatmap' | 'comparison' | 'alerts' | 'settings' | 'screener' | 'calendar'

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token')
      setIsLoggedIn(!!token)
    }
    checkAuth()
    // Listen for storage changes
    window.addEventListener('storage', checkAuth)
    // Check on focus
    window.addEventListener('focus', checkAuth)
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('focus', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setIsLoggedIn(false)
      router.refresh()
      // Refresh the page to update all components
      window.location.reload()
    }
  }

  const menuItems = [
    { id: 'overview' as Tab, label: 'Market Overview', icon: Home },
    { id: 'screener' as Tab, label: 'Coin Screener', icon: Filter },
    { id: 'heatmap' as Tab, label: 'Market Heatmap', icon: Grid },
    { id: 'pump-dump' as Tab, label: 'Pump & Dump', icon: AlertTriangle },
    { id: 'sentiment' as Tab, label: 'Sentiment Analysis', icon: Brain },
    { id: 'charts' as Tab, label: 'Charts', icon: BarChart3 },
    { id: 'comparison' as Tab, label: 'Coin Comparison', icon: GitCompare },
    { id: 'calendar' as Tab, label: 'Market Calendar', icon: Calendar },
    { id: 'portfolio' as Tab, label: 'Portfolio', icon: Briefcase },
    { id: 'watchlist' as Tab, label: 'Watchlist', icon: Star },
    { id: 'alerts' as Tab, label: 'Price Alerts', icon: Bell },
    { id: 'news' as Tab, label: 'News', icon: Newspaper },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 glass z-40 flex flex-col
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <Logo size="md" showText={true} />
          <p className="text-sm text-gray-400 mt-2 ml-11">Crypto Analytics</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsMobileOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  animate-fade-in-up
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
                  }
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0 space-y-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                <LogIn size={20} />
                <span className="font-medium">Sign In</span>
              </Link>
              <Link
                href="/register"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                onClick={() => setIsMobileOpen(false)}
              >
                <UserPlus size={20} />
                <span className="font-medium">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

