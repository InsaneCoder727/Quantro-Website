'use client'

import { useState, useEffect } from 'react'
import { Star, X } from 'lucide-react'
import useSWR from 'swr'
import { fetchTopCoins, Coin } from '@/lib/api'

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const { data: coins = [] } = useSWR('top-coins', fetchTopCoins)

  useEffect(() => {
    const saved = localStorage.getItem('watchlist')
    if (saved) {
      setWatchlist(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist))
    } else {
      localStorage.removeItem('watchlist')
    }
  }, [watchlist])

  const addToWatchlist = (coinId: string) => {
    if (!watchlist.includes(coinId)) {
      setWatchlist([...watchlist, coinId])
    }
  }

  const removeFromWatchlist = (coinId: string) => {
    setWatchlist(watchlist.filter((id) => id !== coinId))
  }

  const watchlistCoins = coins.filter((coin: Coin) =>
    watchlist.includes(coin.id)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Watchlist</h1>
        <p className="text-gray-400">Monitor your favorite cryptocurrencies</p>
      </div>

      {watchlistCoins.length === 0 ? (
        <div className="card text-center py-12">
          <Star className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Your Watchlist is Empty</h3>
          <p className="text-gray-400 mb-6">
            Add coins from the market overview to track them here
          </p>
          <div className="card bg-white/5 max-w-2xl mx-auto">
            <h4 className="font-semibold mb-4">Top Coins (Click to Add)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coins.slice(0, 12).map((coin: Coin) => (
                <button
                  key={coin.id}
                  onClick={() => addToWatchlist(coin.id)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-sm">{coin.symbol.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-gray-400">{coin.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {watchlistCoins.map((coin: Coin) => (
            <div key={coin.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{coin.name}</h3>
                    <p className="text-gray-400 uppercase text-sm">{coin.symbol}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(coin.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Price</div>
                  <div className="text-lg font-semibold">
                    ${coin.current_price?.toLocaleString() || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">24h Change</div>
                  <div
                    className={`text-lg font-semibold ${
                      (coin.price_change_percentage_24h || 0) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2) || '-'}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Market Cap</div>
                  <div className="text-lg font-semibold">
                    ${(coin.market_cap / 1e9).toFixed(2)}B
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                  <div className="text-lg font-semibold">
                    ${(coin.total_volume / 1e6).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Section */}
      {watchlistCoins.length > 0 && (
        <div className="card bg-white/5">
          <h3 className="font-semibold mb-4">Add More Coins</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {coins
              .filter((coin: Coin) => !watchlist.includes(coin.id))
              .slice(0, 12)
              .map((coin: Coin) => (
                <button
                  key={coin.id}
                  onClick={() => addToWatchlist(coin.id)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-sm">
                    {coin.symbol.toUpperCase()}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

