'use client'

import useSWR from 'swr'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { fetchTopCoins, Coin } from '@/lib/api'

export default function MarketOverview() {
  const { data: coins = [], isLoading } = useSWR('top-coins', fetchTopCoins, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0)
  const totalVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0)
  const gainers = coins.filter(coin => (coin.price_change_percentage_24h || 0) > 0).length
  const losers = coins.filter(coin => (coin.price_change_percentage_24h || 0) < 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
        <p className="text-gray-400">Top 100 cryptocurrencies by market cap</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Market Cap</span>
            <DollarSign size={20} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">
            ${(totalMarketCap / 1e12).toFixed(2)}T
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">24h Volume</span>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">
            ${(totalVolume / 1e9).toFixed(2)}B
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Gainers (24h)</span>
            <TrendingUp size={20} className="text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{gainers}</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Losers (24h)</span>
            <TrendingDown size={20} className="text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{losers}</div>
        </div>
      </div>

      {/* Top Coins Table */}
      <div className="card overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Coin</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Market Cap</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Volume</th>
              </tr>
            </thead>
            <tbody>
              {coins.slice(0, 20).map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-400">
                    {coin.market_cap_rank || '-'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{coin.name}</div>
                        <div className="text-sm text-gray-400 uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold">
                    ${coin.current_price?.toLocaleString() || '-'}
                  </td>
                  <td
                    className={`py-4 px-4 text-right font-semibold ${
                      (coin.price_change_percentage_24h || 0) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {coin.price_change_percentage_24h ? (
                      <div className="flex items-center justify-end gap-1">
                        {(coin.price_change_percentage_24h || 0) >= 0 ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-300">
                    ${(coin.market_cap / 1e9).toFixed(2)}B
                  </td>
                  <td className="py-4 px-4 text-right text-gray-300">
                    ${(coin.total_volume / 1e6).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

