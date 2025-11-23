'use client'

import { useState, useEffect } from 'react'
import { Settings, Bell, Moon, Sun, RefreshCw, Download, Trash2 } from 'lucide-react'
import TwoFactorSetup from './TwoFactorSetup'
import AuthPrompt from './AuthPrompt'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token')
      setIsLoggedIn(!!token)
      if (token) {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          setUser(JSON.parse(userStr))
        }
      }
    }
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    pumpDump: true,
    news: false,
  })

  const [refreshInterval, setRefreshInterval] = useState(60)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setNotifications(settings.notifications || notifications)
      setRefreshInterval(settings.refreshInterval || 60)
      setTheme(settings.theme || 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify({
      notifications,
      refreshInterval,
      theme,
    }))
  }, [notifications, refreshInterval, theme])

  const exportData = () => {
    const portfolio = localStorage.getItem('portfolio')
    const watchlist = localStorage.getItem('watchlist')
    const alerts = localStorage.getItem('price_alerts')

    const data = {
      portfolio: portfolio ? JSON.parse(portfolio) : [],
      watchlist: watchlist ? JSON.parse(watchlist) : [],
      alerts: alerts ? JSON.parse(alerts) : [],
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crypto-dashboard-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('portfolio')
      localStorage.removeItem('watchlist')
      localStorage.removeItem('price_alerts')
      alert('All data has been cleared.')
    }
  }

  // Settings page requires authentication for security features
  if (!isLoggedIn) {
    return <AuthPrompt feature="Settings" description="Create an account to access account settings, 2FA, and security preferences" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings className="text-blue-500" size={32} />
          Settings
        </h1>
        <p className="text-gray-400">Manage your dashboard preferences</p>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-semibold">Price Alerts</div>
              <div className="text-sm text-gray-400">Get notified when price alerts trigger</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.priceAlerts}
              onChange={(e) =>
                setNotifications({ ...notifications, priceAlerts: e.target.checked })
              }
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-semibold">Pump & Dump Alerts</div>
              <div className="text-sm text-gray-400">Get notified about pump & dump detections</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.pumpDump}
              onChange={(e) =>
                setNotifications({ ...notifications, pumpDump: e.target.checked })
              }
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-semibold">News Updates</div>
              <div className="text-sm text-gray-400">Get notified about latest crypto news</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.news}
              onChange={(e) =>
                setNotifications({ ...notifications, news: e.target.checked })
              }
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Data Refresh */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold">Data Refresh</h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Auto-refresh Interval (seconds)
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
            style={{ colorScheme: 'dark' }}
          >
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="600">10 minutes</option>
          </select>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      {user && <TwoFactorSetup user={user} />}

      {/* Data Management */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Download className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold">Data Management</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            <Download size={20} />
            Export All Data
          </button>
          <button
            onClick={clearData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            <Trash2 size={20} />
            Clear All Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card bg-blue-500/10 border-blue-500/30">
        <h2 className="text-xl font-bold mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-300">
          <p>
              <strong>Quantro</strong> - Advanced cryptocurrency analytics and pump & dump detection
          </p>
          <p>
            Version: <strong>1.0.0</strong>
          </p>
          <p>
            Features: Market Overview, Pump & Dump Detection, Sentiment Analysis, Price Charts, Portfolio Tracker, Price Alerts, and more.
          </p>
        </div>
      </div>
    </div>
  )
}

