'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { Filter, Search, SlidersHorizontal, Download, Save, X, TrendingUp, TrendingDown } from 'lucide-react'
import { fetchTopCoins, Coin } from '@/lib/api'

interface FilterState {
  minMarketCap: string
  maxMarketCap: string
  minVolume: string
  maxVolume: string
  minPriceChange: string
  maxPriceChange: string
  minPrice: string
  maxPrice: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export default function CoinScreener() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    minMarketCap: '',
    maxMarketCap: '',
    minVolume: '',
    maxVolume: '',
    minPriceChange: '',
    maxPriceChange: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'market_cap_rank',
    sortOrder: 'asc',
  })

  const { data: coins = [], isLoading } = useSWR('top-coins-250', () => fetchTopCoins(250), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  const filteredCoins = useMemo(() => {
    let filtered = [...coins]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      )
    }

    // Market cap filter
    if (filters.minMarketCap) {
      const min = parseFloat(filters.minMarketCap) * 1e9 // Convert billions to actual value
      filtered = filtered.filter((coin) => coin.market_cap >= min)
    }
    if (filters.maxMarketCap) {
      const max = parseFloat(filters.maxMarketCap) * 1e9
      filtered = filtered.filter((coin) => coin.market_cap <= max)
    }

    // Volume filter
    if (filters.minVolume) {
      const min = parseFloat(filters.minVolume) * 1e6 // Convert millions to actual value
      filtered = filtered.filter((coin) => (coin.total_volume || 0) >= min)
    }
    if (filters.maxVolume) {
      const max = parseFloat(filters.maxVolume) * 1e6
      filtered = filtered.filter((coin) => (coin.total_volume || 0) <= max)
    }

    // Price change filter
    if (filters.minPriceChange) {
      const min = parseFloat(filters.minPriceChange)
      filtered = filtered.filter((coin) => (coin.price_change_percentage_24h || 0) >= min)
    }
    if (filters.maxPriceChange) {
      const max = parseFloat(filters.maxPriceChange)
      filtered = filtered.filter((coin) => (coin.price_change_percentage_24h || 0) <= max)
    }

    // Price filter
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice)
      filtered = filtered.filter((coin) => (coin.current_price || 0) >= min)
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice)
      filtered = filtered.filter((coin) => (coin.current_price || 0) <= max)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number = 0
      let bValue: number = 0

      switch (filters.sortBy) {
        case 'market_cap_rank':
          aValue = a.market_cap_rank || 0
          bValue = b.market_cap_rank || 0
          break
        case 'price':
          aValue = a.current_price || 0
          bValue = b.current_price || 0
          break
        case 'volume':
          aValue = a.total_volume || 0
          bValue = b.total_volume || 0
          break
        case 'change':
          aValue = a.price_change_percentage_24h || 0
          bValue = b.price_change_percentage_24h || 0
          break
        case 'market_cap':
          aValue = a.market_cap || 0
          bValue = b.market_cap || 0
          break
      }

      if (filters.sortOrder === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    return filtered
  }, [coins, filters, searchQuery])

  const clearFilters = () => {
    setFilters({
      minMarketCap: '',
      maxMarketCap: '',
      minVolume: '',
      maxVolume: '',
      minPriceChange: '',
      maxPriceChange: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'market_cap_rank',
      sortOrder: 'asc',
    })
    setSearchQuery('')
  }

  const exportResults = () => {
    const csv = [
      ['Rank', 'Name', 'Symbol', 'Price (USD)', '24h Change (%)', 'Market Cap (B)', 'Volume (M)'].join(','),
      ...filteredCoins.map((coin) =>
        [
          coin.market_cap_rank || '',
          coin.name,
          coin.symbol.toUpperCase(),
          coin.current_price || 0,
          coin.price_change_percentage_24h?.toFixed(2) || 0,
          (coin.market_cap / 1e9).toFixed(2),
          (coin.total_volume / 1e6).toFixed(2),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quantro-screener-results-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasActiveFilters = useMemo(() => {
    return (
      filters.minMarketCap ||
      filters.maxMarketCap ||
      filters.minVolume ||
      filters.maxVolume ||
      filters.minPriceChange ||
      filters.maxPriceChange ||
      filters.minPrice ||
      filters.maxPrice ||
      searchQuery
    )
  }, [filters, searchQuery])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Filter className="text-blue-500" size={32} />
            Coin Screener
          </h1>
          <p className="text-gray-400">Filter and discover cryptocurrencies</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Filter className="text-blue-500" size={32} />
            Coin Screener
          </h1>
          <p className="text-gray-400">Filter and discover cryptocurrencies by your criteria</p>
        </div>
        <div className="flex gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              <X size={20} />
              Clear Filters
            </button>
          )}
          <button
            onClick={exportResults}
            disabled={filteredCoins.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filter Toggle */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coins by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <SlidersHorizontal size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Market Cap (Billions)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minMarketCap}
                    onChange={(e) => setFilters({ ...filters, minMarketCap: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxMarketCap}
                    onChange={(e) => setFilters({ ...filters, maxMarketCap: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  24h Volume (Millions)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({ ...filters, minVolume: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxVolume}
                    onChange={(e) => setFilters({ ...filters, maxVolume: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  24h Price Change (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPriceChange}
                    onChange={(e) => setFilters({ ...filters, minPriceChange: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPriceChange}
                    onChange={(e) => setFilters({ ...filters, maxPriceChange: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="market_cap_rank">Market Cap Rank</option>
                  <option value="price">Price</option>
                  <option value="volume">24h Volume</option>
                  <option value="change">24h Change</option>
                  <option value="market_cap">Market Cap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                  className="w-full px-3 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Showing <span className="font-semibold text-white">{filteredCoins.length}</span> of{' '}
          <span className="font-semibold text-white">{coins.length}</span> coins
        </p>
      </div>

      {/* Results Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Coin</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Market Cap</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <tr
                    key={coin.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-400">#{coin.market_cap_rank || '-'}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{coin.name}</div>
                          <div className="text-sm text-gray-400 uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">
                      ${coin.current_price?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
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
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No coins found matching your filters. Try adjusting your criteria.
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

