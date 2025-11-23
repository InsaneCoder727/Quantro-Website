'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, Flame, ArrowUp, ArrowDown } from 'lucide-react'
import { fetchTopCoins, Coin } from '@/lib/api'

export default function TrendingCoins() {
  const { data: coins = [], isLoading } = useSWR('top-coins-100', () => fetchTopCoins(100), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  const { topGainers, topLosers } = useMemo(() => {
    const sorted = [...coins].sort((a, b) => {
      const changeA = a.price_change_percentage_24h || 0
      const changeB = b.price_change_percentage_24h || 0
      return changeB - changeA
    })

    return {
      topGainers: sorted.filter(c => (c.price_change_percentage_24h || 0) > 0).slice(0, 10),
      topLosers: sorted.filter(c => (c.price_change_percentage_24h || 0) < 0).slice(-10).reverse(),
    }
  }, [coins])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-400" size={24} />
          <h2 className="text-xl font-bold">Top Gainers (24h)</h2>
        </div>
        <div className="space-y-3">
          {topGainers.length > 0 ? (
            topGainers.map((coin, index) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-gray-400 font-semibold w-6">#{index + 1}</div>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${coin.current_price?.toLocaleString()}</div>
                  <div className="text-sm text-green-400 flex items-center justify-end gap-1">
                    <ArrowUp size={14} />
                    +{coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">No gainers found</div>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-red-400" size={24} />
          <h2 className="text-xl font-bold">Top Losers (24h)</h2>
        </div>
        <div className="space-y-3">
          {topLosers.length > 0 ? (
            topLosers.map((coin, index) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-gray-400 font-semibold w-6">#{index + 1}</div>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${coin.current_price?.toLocaleString()}</div>
                  <div className="text-sm text-red-400 flex items-center justify-end gap-1">
                    <ArrowDown size={14} />
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">No losers found</div>
          )}
        </div>
      </div>
    </div>
  )
}

