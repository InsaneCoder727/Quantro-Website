'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Bell, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { fetchTopCoins, Coin } from '@/lib/api'

interface PriceAlert {
  id: string
  coinId: string
  coinName: string
  coinSymbol: string
  targetPrice: number
  direction: 'above' | 'below'
  isActive: boolean
  triggered: boolean
}

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    coinId: '',
    targetPrice: '',
    direction: 'above' as 'above' | 'below',
  })

  const { data: coins = [], isLoading: coinsLoading } = useSWR('top-coins-30', () => fetchTopCoins(30), {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem('price_alerts')
    if (saved) {
      setAlerts(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('price_alerts', JSON.stringify(alerts))
  }, [alerts])

  // Check alerts against current prices
  useEffect(() => {
    if (alerts.length > 0 && coins.length > 0) {
      const updatedAlerts = alerts.map((alert) => {
        if (alert.triggered || !alert.isActive) return alert

        const coin = coins.find((c: Coin) => c.id === alert.coinId)
        if (!coin) return alert

        const currentPrice = coin.current_price || 0
        let triggered = false

        if (alert.direction === 'above' && currentPrice >= alert.targetPrice) {
          triggered = true
        } else if (alert.direction === 'below' && currentPrice <= alert.targetPrice) {
          triggered = true
        }

        return { ...alert, triggered }
      })

      if (JSON.stringify(updatedAlerts) !== JSON.stringify(alerts)) {
        setAlerts(updatedAlerts)
      }
    }
  }, [coins, alerts])

  const addAlert = () => {
    if (newAlert.coinId && newAlert.targetPrice) {
      const coin = coins.find((c: Coin) => c.id === newAlert.coinId)
      if (coin) {
        const alert: PriceAlert = {
          id: Date.now().toString(),
          coinId: newAlert.coinId,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          targetPrice: parseFloat(newAlert.targetPrice),
          direction: newAlert.direction,
          isActive: true,
          triggered: false,
        }
        setAlerts([...alerts, alert])
        setNewAlert({ coinId: '', targetPrice: '', direction: 'above' })
        setShowAddForm(false)
      }
    }
  }

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ))
  }

  const activeAlerts = alerts.filter(a => a.isActive && !a.triggered).length
  const triggeredAlerts = alerts.filter(a => a.triggered).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Bell className="text-yellow-500" size={32} />
            Price Alerts
          </h1>
          <p className="text-gray-400">Set custom price alerts for your favorite coins</p>
        </div>
        <div className="flex gap-4">
          <div className="card text-center">
            <div className="text-sm text-gray-400 mb-1">Active</div>
            <div className="text-2xl font-bold text-blue-400">{activeAlerts}</div>
          </div>
          <div className="card text-center">
            <div className="text-sm text-gray-400 mb-1">Triggered</div>
            <div className="text-2xl font-bold text-green-400">{triggeredAlerts}</div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors h-fit"
          >
            <Plus size={20} />
            New Alert
          </button>
        </div>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="card bg-white/5">
          <h3 className="font-semibold mb-4">Create Price Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Coin
              </label>
              <select
                value={newAlert.coinId}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, coinId: e.target.value })
                }
                disabled={coinsLoading || coins.length === 0}
                className="w-full px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-black [&>option]:text-white"
                style={{ colorScheme: 'dark' }}
              >
                <option value="">Select coin</option>
                {coins.map((coin: Coin) => (
                  <option key={coin.id} value={coin.id} className="bg-black text-white">
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Direction
              </label>
              <select
                value={newAlert.direction}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, direction: e.target.value as 'above' | 'below' })
                }
                className="w-full px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
                style={{ colorScheme: 'dark' }}
              >
                <option value="above" className="bg-black text-white">Price Above</option>
                <option value="below" className="bg-black text-white">Price Below</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Price (USD)
              </label>
              <input
                type="number"
                step="any"
                value={newAlert.targetPrice}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, targetPrice: e.target.value })
                }
                placeholder="0.00"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addAlert}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Add Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Your Alerts</h2>
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell className="mx-auto text-gray-500 mb-4" size={48} />
            <p>No alerts set yet. Create your first price alert above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const coin = coins.find((c: Coin) => c.id === alert.coinId)
              const currentPrice = coin?.current_price || 0

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${
                    alert.triggered
                      ? 'bg-green-500/10 border-green-500/50'
                      : alert.isActive
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gray-800/50 border-gray-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {coin && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">{alert.coinName}</div>
                        <div className="text-sm text-gray-400">
                          {alert.direction === 'above' ? 'Alert when price goes' : 'Alert when price goes'}{' '}
                          <span className="font-semibold text-white">
                            {alert.direction === 'above' ? 'above' : 'below'} ${alert.targetPrice.toLocaleString()}
                          </span>
                        </div>
                        {coin && (
                          <div className="text-xs text-gray-500 mt-1">
                            Current: ${currentPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {alert.triggered && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 size={20} />
                          <span className="text-sm font-semibold">Triggered!</span>
                        </div>
                      )}
                      {!alert.triggered && (
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            alert.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {alert.isActive ? 'Active' : 'Paused'}
                        </button>
                      )}
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

