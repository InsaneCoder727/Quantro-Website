'use client'

import { Home, TrendingUp, AlertTriangle, BarChart3, Briefcase, Star, Newspaper, Menu, X, LogOut, Brain, Grid, GitCompare, Bell, Settings } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'overview' | 'pump-dump' | 'charts' | 'portfolio' | 'watchlist' | 'news' | 'sentiment' | 'heatmap' | 'comparison' | 'alerts' | 'settings'

interface SidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const menuItems = [
    { id: 'overview' as Tab, label: 'Market Overview', icon: Home },
    { id: 'heatmap' as Tab, label: 'Market Heatmap', icon: Grid },
    { id: 'pump-dump' as Tab, label: 'Pump & Dump', icon: AlertTriangle },
    { id: 'sentiment' as Tab, label: 'Sentiment Analysis', icon: Brain },
    { id: 'charts' as Tab, label: 'Charts', icon: BarChart3 },
    { id: 'comparison' as Tab, label: 'Coin Comparison', icon: GitCompare },
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
          fixed top-0 left-0 h-full w-64 glass z-40 pb-20
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quantro
          </h1>
          <p className="text-sm text-gray-400 mt-1">Crypto Analytics</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
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
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

