'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle2, TrendingUp, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: 'price_alert' | 'pump_dump' | 'news' | 'system'
  title: string
  message: string
  timestamp: number
  read: boolean
  link?: string
}

export default function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()

  useEffect(() => {
    loadNotifications()
    
    // Load from localStorage
    const saved = localStorage.getItem('notifications')
    if (saved) {
      setNotifications(JSON.parse(saved))
    }

    // Check for price alerts
    const checkPriceAlerts = () => {
      const alerts = localStorage.getItem('price_alerts')
      if (alerts) {
        const priceAlerts = JSON.parse(alerts)
        const triggeredAlerts = priceAlerts.filter((a: any) => a.triggered && !a.notified)
        
        if (triggeredAlerts.length > 0) {
          triggeredAlerts.forEach((alert: any) => {
            addNotification({
              type: 'price_alert',
              title: `Price Alert Triggered`,
              message: `${alert.coinName} (${alert.coinSymbol}) ${alert.direction === 'above' ? 'rose above' : 'fell below'} $${alert.targetPrice}`,
              link: '/dashboard?tab=alerts',
            })
          })
          
          // Mark as notified
          priceAlerts.forEach((a: any) => {
            if (a.triggered) a.notified = true
          })
          localStorage.setItem('price_alerts', JSON.stringify(priceAlerts))
        }
      }
    }

    // Check every 30 seconds
    const interval = setInterval(checkPriceAlerts, 30000)
    checkPriceAlerts()

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    }
    
    const updated = [newNotification, ...notifications]
    setNotifications(updated.slice(0, 50)) // Keep last 50
    localStorage.setItem('notifications', JSON.stringify(updated.slice(0, 50)))
  }

  const loadNotifications = () => {
    const saved = localStorage.getItem('notifications')
    if (saved) {
      setNotifications(JSON.parse(saved))
    }
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.removeItem('notifications')
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.link) {
      router.push(notification.link)
      onClose()
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp size={20} className="text-blue-400" />
      case 'pump_dump':
        return <AlertCircle size={20} className="text-red-400" />
      case 'system':
        return <CheckCircle2 size={20} className="text-green-400" />
      default:
        return <Bell size={20} className="text-gray-400" />
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute right-4 top-full mt-2 w-96 bg-gray-900 border border-white/20 rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-blue-400" />
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="text-xs text-gray-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-white/10">
            <button
              onClick={clearAll}
              className="w-full text-sm text-red-400 hover:text-red-300 text-center"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </>
  )
}

