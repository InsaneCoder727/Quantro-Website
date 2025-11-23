'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Search } from 'lucide-react'
import { fetchTopCoins, searchCoins, Coin } from '@/lib/api'

export default function MarketOverview() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Load top 30 coins when not searching
  const { data: topCoins = [], isLoading: topCoinsLoading, error: topCoinsError } = useSWR(
    debouncedSearch ? null : 'top-coins-30',
    () => fetchTopCoins(30),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
    }
  )

  // Search for coins when there's a search query
  const { data: searchResults = [], isLoading: searchLoading, error: searchError } = useSWR(
    debouncedSearch && debouncedSearch.length >= 2 ? `search-coins-${debouncedSearch}` : null,
    () => searchCoins(debouncedSearch),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  // Determine which coins to display
  const coins = debouncedSearch && debouncedSearch.length >= 2 ? searchResults : topCoins
  const isLoading = debouncedSearch && debouncedSearch.length >= 2 ? searchLoading : topCoinsLoading
  const error = debouncedSearch && debouncedSearch.length >= 2 ? searchError : topCoinsError

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
          <p className="text-gray-400">Top 100 cryptocurrencies by market cap</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!isLoading && coins.length === 0 && !error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
          <p className="text-gray-400">Top 10 cryptocurrencies by market cap</p>
        </div>
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 mb-4">Loading market data...</p>
          <p className="text-sm text-gray-500">Fetching real-time prices from CoinGecko...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
          <p className="text-gray-400">Top 10 cryptocurrencies by market cap</p>
        </div>
        <div className="card text-center py-12 bg-yellow-500/10 border-yellow-500/30">
          <p className="text-yellow-400 mb-4">Unable to fetch real-time data</p>
          <p className="text-sm text-gray-400">Please refresh the page to try again.</p>
        </div>
      </div>
    )
  }

  const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0)
  const totalVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0)
  const gainers = coins.filter(coin => (coin.price_change_percentage_24h || 0) > 0).length
  const losers = coins.filter(coin => (coin.price_change_percentage_24h || 0) < 0).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
          <p className="text-gray-400">Top 30 cryptocurrencies by market cap</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {debouncedSearch && debouncedSearch.length >= 2 ? `Search Results (${coins.length})` : 'Top 30 Cryptocurrencies'}
          </h2>
          {(debouncedSearch && debouncedSearch.length >= 2) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setDebouncedSearch('')
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear search
            </button>
          )}
          {(debouncedSearch && debouncedSearch.length >= 2 && searchLoading) && (
            <div className="text-sm text-gray-400">Searching...</div>
          )}
        </div>
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
              {coins.length > 0 ? (
                coins.map((coin) => (
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32'
                          }}
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
                      ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}
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
                ))
              ) : debouncedSearch && debouncedSearch.length >= 2 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    {searchLoading ? 'Searching...' : 'No coins found. Try a different search term.'}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No coins available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

