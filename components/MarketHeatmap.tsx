'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { fetchTopCoins, Coin } from '@/lib/api'

export default function MarketHeatmap() {
  const { data: coins = [], isLoading } = useSWR('top-coins-100', () => fetchTopCoins(100), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      const changeA = a.price_change_percentage_24h || 0
      const changeB = b.price_change_percentage_24h || 0
      return changeB - changeA
    })
  }, [coins])

  const getColorIntensity = (change: number) => {
    const absChange = Math.abs(change)
    if (absChange >= 15) return change > 0 ? 'bg-green-600' : 'bg-red-600'
    if (absChange >= 10) return change > 0 ? 'bg-green-500' : 'bg-red-500'
    if (absChange >= 5) return change > 0 ? 'bg-green-400' : 'bg-red-400'
    if (absChange >= 2) return change > 0 ? 'bg-green-300/50' : 'bg-red-300/50'
    return 'bg-gray-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Heatmap</h1>
          <p className="text-gray-400">Visual representation of market performance</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market Heatmap</h1>
        <p className="text-gray-400">Visual representation of 24h price changes</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">24h Price Performance</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span>Down</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Up</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {sortedCoins.slice(0, 48).map((coin) => {
            const change = coin.price_change_percentage_24h || 0
            return (
              <div
                key={coin.id}
                className={`${getColorIntensity(change)} p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer relative group`}
              >
                <div className="text-white text-xs font-semibold mb-1">
                  {coin.symbol.toUpperCase()}
                </div>
                <div className="text-white text-sm font-bold">
                  ${coin.current_price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </div>
                <div
                  className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
                    change >= 0 ? 'text-green-100' : 'text-red-100'
                  }`}
                >
                  {change >= 0 ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {Math.abs(change).toFixed(2)}%
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block z-50 bg-gray-950 border-2 border-white/30 rounded-lg p-4 shadow-2xl min-w-[220px] backdrop-blur-md">
                  <div className="font-bold text-white text-base mb-2 pb-2 border-b border-white/20">{coin.name}</div>
                  <div className="text-sm text-gray-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white font-semibold">${coin.current_price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Change:</span>
                      <span className={`font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Cap:</span>
                      <span className="text-white font-semibold">${(coin.market_cap / 1e9).toFixed(2)}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume:</span>
                      <span className="text-white font-semibold">${(coin.total_volume / 1e6).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

