'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { AlertTriangle, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { fetchTopCoins, detectPumpAndDump, PumpDumpAlert } from '@/lib/api'

export default function PumpDumpDetector() {
  const { data: coins = [], isLoading } = useSWR('top-coins', fetchTopCoins, {
    refreshInterval: 60000, // Refresh every minute
  })

  const [alerts, setAlerts] = useState<PumpDumpAlert[]>([])

  useEffect(() => {
    if (coins.length > 0) {
      const detectedAlerts = detectPumpAndDump(coins)
      setAlerts(detectedAlerts)
    }
  }, [coins])

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-500/20 border-red-500/50'
    if (score >= 50) return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
    return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'CRITICAL RISK'
    if (score >= 50) return 'HIGH RISK'
    return 'MEDIUM RISK'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={32} />
            Pump & Dump Detection
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time analysis of suspicious market activity
          </p>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Active Alerts</div>
          <div className="text-3xl font-bold text-orange-400">{alerts.length}</div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card text-center py-12">
          <AlertTriangle className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No Alerts Detected</h3>
          <p className="text-gray-400">
            The market appears stable. No pump-and-dump patterns detected.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert, index) => (
            <div
              key={`${alert.coin.id}-${index}`}
              className={`card border-2 ${getRiskColor(alert.riskScore)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={alert.coin.image}
                    alt={alert.coin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{alert.coin.name}</h3>
                    <p className="text-gray-400 text-sm uppercase">
                      {alert.coin.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(
                      alert.riskScore
                    )}`}
                  >
                    {getRiskLabel(alert.riskScore)}
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    Risk Score: {alert.riskScore}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <TrendingUp size={16} />
                    Price Change
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      alert.coin.price_change_percentage_24h > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {alert.coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Activity size={16} />
                    Volume Spike
                  </div>
                  <div className="text-lg font-semibold text-orange-400">
                    {alert.indicators.volumeSpike.toFixed(0)}%
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign size={16} />
                    24h Volume
                  </div>
                  <div className="text-lg font-semibold">
                    ${(alert.coin.total_volume / 1e6).toFixed(1)}M
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    Market Cap
                  </div>
                  <div className="text-lg font-semibold">
                    ${(alert.coin.market_cap / 1e6).toFixed(1)}M
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    Current Price: ${alert.coin.current_price.toLocaleString()}
                  </div>
                  <div className="text-gray-400">
                    Rank: #{alert.coin.market_cap_rank}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card bg-blue-500/10 border-blue-500/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle size={20} />
          How It Works
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Our algorithm analyzes multiple indicators including volume spikes, price
          surges, market cap changes, and volume-to-market-cap ratios to identify
          potential pump-and-dump schemes. Higher risk scores indicate increased
          likelihood of manipulation. Always conduct your own research before making
          investment decisions.
        </p>
      </div>
    </div>
  )
}

