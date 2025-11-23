'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { GitCompare, X, TrendingUp, TrendingDown, BarChart3, DollarSign, Activity } from 'lucide-react'
import { fetchTopCoins, Coin } from '@/lib/api'

export default function CoinComparison() {
  const [selectedCoins, setSelectedCoins] = useState<string[]>([])
  const [compareCoin, setCompareCoin] = useState<string>('')

  const { data: coins = [], isLoading } = useSWR('top-coins-100', () => fetchTopCoins(100), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  const compareCoinsData = useMemo(() => {
    return selectedCoins
      .map(id => coins.find((c: Coin) => c.id === id))
      .filter(Boolean) as Coin[]
  }, [selectedCoins, coins])

  const addCoinToComparison = (coinId: string) => {
    if (!selectedCoins.includes(coinId) && selectedCoins.length < 4) {
      setSelectedCoins([...selectedCoins, coinId])
    }
  }

  const removeCoinFromComparison = (coinId: string) => {
    setSelectedCoins(selectedCoins.filter(id => id !== coinId))
  }

  const getBestPerformer = () => {
    if (compareCoinsData.length === 0) return null
    return compareCoinsData.reduce((best, coin) => {
      const bestChange = best.price_change_percentage_24h || 0
      const coinChange = coin.price_change_percentage_24h || 0
      return coinChange > bestChange ? coin : best
    })
  }

  const getWorstPerformer = () => {
    if (compareCoinsData.length === 0) return null
    return compareCoinsData.reduce((worst, coin) => {
      const worstChange = worst.price_change_percentage_24h || 0
      const coinChange = coin.price_change_percentage_24h || 0
      return coinChange < worstChange ? coin : worst
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <GitCompare className="text-blue-500" size={32} />
            Coin Comparison
          </h1>
          <p className="text-gray-400">Compare up to 4 coins side-by-side</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const best = getBestPerformer()
  const worst = getWorstPerformer()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <GitCompare className="text-blue-500" size={32} />
          Coin Comparison
        </h1>
        <p className="text-gray-400">Compare up to 4 coins side-by-side</p>
      </div>

      {/* Add Coins to Compare */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Select Coins to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={compareCoin}
            onChange={(e) => setCompareCoin(e.target.value)}
            className="w-full px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
            style={{ colorScheme: 'dark' }}
          >
            <option value="">Select a coin...</option>
            {coins
              .filter((coin: Coin) => !selectedCoins.includes(coin.id))
              .slice(0, 50)
              .map((coin: Coin) => (
                <option key={coin.id} value={coin.id} className="bg-black text-white">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              if (compareCoin && selectedCoins.length < 4) {
                addCoinToComparison(compareCoin)
                setCompareCoin('')
              }
            }}
            disabled={!compareCoin || selectedCoins.length >= 4}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            Add to Comparison
          </button>
        </div>
        {selectedCoins.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCoins.map((coinId) => {
              const coin = coins.find((c: Coin) => c.id === coinId)
              if (!coin) return null
              return (
                <div
                  key={coinId}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg"
                >
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-semibold">{coin.symbol.toUpperCase()}</span>
                  <button
                    onClick={() => removeCoinFromComparison(coinId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {compareCoinsData.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Metric</th>
                  {compareCoinsData.map((coin) => (
                    <th key={coin.id} className="text-center py-3 px-4">
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{coin.name}</div>
                          <div className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">Current Price</td>
                  {compareCoinsData.map((coin) => (
                    <td key={coin.id} className="py-4 px-4 text-center font-semibold">
                      ${coin.current_price?.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">24h Change</td>
                  {compareCoinsData.map((coin) => (
                    <td
                      key={coin.id}
                      className={`py-4 px-4 text-center font-semibold ${
                        (coin.price_change_percentage_24h || 0) >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {(coin.price_change_percentage_24h || 0) >= 0 ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">Market Cap</td>
                  {compareCoinsData.map((coin) => (
                    <td key={coin.id} className="py-4 px-4 text-center">
                      ${(coin.market_cap / 1e9).toFixed(2)}B
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">24h Volume</td>
                  {compareCoinsData.map((coin) => (
                    <td key={coin.id} className="py-4 px-4 text-center">
                      ${(coin.total_volume / 1e6).toFixed(1)}M
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">Market Cap Rank</td>
                  {compareCoinsData.map((coin) => (
                    <td key={coin.id} className="py-4 px-4 text-center font-semibold">
                      #{coin.market_cap_rank}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">24h High</td>
                  {compareCoinsData.map((coin) => (
                    <td key={coin.id} className="py-4 px-4 text-center">
                      ${coin.high_24h?.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-400 font-medium">24h Low</td>
                  {compareCoinsData.map((coin) => (
                    <td key={coin.id} className="py-4 px-4 text-center">
                      ${coin.low_24h?.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-400 font-medium">Price Range</td>
                  {compareCoinsData.map((coin) => {
                    const range = coin.high_24h && coin.low_24h
                      ? (((coin.high_24h - coin.low_24h) / coin.low_24h) * 100)
                      : 0
                    return (
                      <td key={coin.id} className="py-4 px-4 text-center">
                        {range.toFixed(2)}%
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      {compareCoinsData.length > 1 && best && worst && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-green-400" size={24} />
              <h3 className="text-lg font-semibold">Best Performer</h3>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={best.image}
                alt={best.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-lg">{best.name}</div>
                <div className="text-green-400 font-bold">
                  +{best.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-red-500/10 border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="text-red-400" size={24} />
              <h3 className="text-lg font-semibold">Worst Performer</h3>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={worst.image}
                alt={worst.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-lg">{worst.name}</div>
                <div className="text-red-400 font-bold">
                  {worst.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

