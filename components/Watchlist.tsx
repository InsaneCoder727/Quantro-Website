'use client'

import { useState, useEffect } from 'react'
import { Star, X, Plus, FolderPlus, Folder, Edit2, Trash2 } from 'lucide-react'
import useSWR from 'swr'
import { fetchTopCoins, Coin } from '@/lib/api'

interface WatchlistGroup {
  id: string
  name: string
  coinIds: string[]
}

export default function Watchlist() {
  const [groups, setGroups] = useState<WatchlistGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | 'all' | 'uncategorized'>('all')
  const [showAddGroupForm, setShowAddGroupForm] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [uncategorizedCoins, setUncategorizedCoins] = useState<string[]>([])

  const { data: coins = [], isLoading } = useSWR('top-coins-250', () => fetchTopCoins(250), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  // Load from localStorage
  useEffect(() => {
    const savedGroups = localStorage.getItem('watchlist_groups')
    const savedUncategorized = localStorage.getItem('watchlist_uncategorized')
    
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    }
    if (savedUncategorized) {
      setUncategorizedCoins(JSON.parse(savedUncategorized))
    } else {
      // Migrate old watchlist format
      const oldWatchlist = localStorage.getItem('watchlist')
      if (oldWatchlist) {
        setUncategorizedCoins(JSON.parse(oldWatchlist))
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem('watchlist_groups', JSON.stringify(groups))
    } else {
      localStorage.removeItem('watchlist_groups')
    }
  }, [groups])

  useEffect(() => {
    if (uncategorizedCoins.length > 0) {
      localStorage.setItem('watchlist_uncategorized', JSON.stringify(uncategorizedCoins))
    } else {
      localStorage.removeItem('watchlist_uncategorized')
    }
  }, [uncategorizedCoins])

  const createGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: WatchlistGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName.trim(),
        coinIds: [],
      }
      setGroups([...groups, newGroup])
      setNewGroupName('')
      setShowAddGroupForm(false)
    }
  }

  const deleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId)
    if (group) {
      // Move coins to uncategorized
      setUncategorizedCoins([...uncategorizedCoins, ...group.coinIds])
      setGroups(groups.filter(g => g.id !== groupId))
      if (selectedGroup === groupId) {
        setSelectedGroup('all')
      }
    }
  }

  const addToWatchlist = (coinId: string, groupId?: string) => {
    if (groupId && groupId !== 'uncategorized') {
      // Add to specific group
      setGroups(
        groups.map((g) =>
          g.id === groupId
            ? { ...g, coinIds: [...g.coinIds, coinId] }
            : g
        )
      )
    } else {
      // Add to uncategorized
      if (!uncategorizedCoins.includes(coinId)) {
        setUncategorizedCoins([...uncategorizedCoins, coinId])
      }
    }
  }

  const removeFromWatchlist = (coinId: string, groupId?: string) => {
    if (groupId && groupId !== 'uncategorized' && groupId !== 'all') {
      // Remove from specific group
      setGroups(
        groups.map((g) =>
          g.id === groupId
            ? { ...g, coinIds: g.coinIds.filter((id) => id !== coinId) }
            : g
        )
      )
    } else {
      // Remove from uncategorized
      setUncategorizedCoins(uncategorizedCoins.filter((id) => id !== coinId))
    }
  }

  const moveToGroup = (coinId: string, targetGroupId: string) => {
    // Remove from current location
    const currentGroup = groups.find(g => g.coinIds.includes(coinId))
    if (currentGroup) {
      setGroups(
        groups.map((g) =>
          g.id === currentGroup.id
            ? { ...g, coinIds: g.coinIds.filter((id) => id !== coinId) }
            : g
        )
      )
    } else {
      setUncategorizedCoins(uncategorizedCoins.filter((id) => id !== coinId))
    }

    // Add to target group
    if (targetGroupId !== 'uncategorized') {
      setGroups(
        groups.map((g) =>
          g.id === targetGroupId
            ? { ...g, coinIds: [...g.coinIds, coinId] }
            : g
        )
      )
    } else {
      setUncategorizedCoins([...uncategorizedCoins, coinId])
    }
  }

  const getAllWatchlistCoinIds = () => {
    const groupCoinIds = groups.flatMap(g => g.coinIds)
    return Array.from(new Set([...uncategorizedCoins, ...groupCoinIds]))
  }

  const getVisibleCoins = () => {
    if (selectedGroup === 'all') {
      return getAllWatchlistCoinIds()
    } else if (selectedGroup === 'uncategorized') {
      return uncategorizedCoins
    } else {
      const group = groups.find(g => g.id === selectedGroup)
      return group ? group.coinIds : []
    }
  }

  const visibleCoinIds = getVisibleCoins()
  const watchlistCoins = coins.filter((coin: Coin) => visibleCoinIds.includes(coin.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Watchlist</h1>
          <p className="text-gray-400">Organize and monitor your favorite cryptocurrencies</p>
        </div>
        <button
          onClick={() => setShowAddGroupForm(!showAddGroupForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          <FolderPlus size={20} />
          New Group
        </button>
      </div>

      {/* Create Group Form */}
      {showAddGroupForm && (
        <div className="card bg-white/5">
          <h3 className="font-semibold mb-4">Create New Group</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name (e.g., DeFi, Layer 1, Meme Coins)"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && createGroup()}
            />
            <button
              onClick={createGroup}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowAddGroupForm(false)
                setNewGroupName('')
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Groups Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold mb-4">Groups</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedGroup === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star size={16} />
                  All Coins
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {getAllWatchlistCoinIds().length}
                </span>
              </button>

              {uncategorizedCoins.length > 0 && (
                <button
                  onClick={() => setSelectedGroup('uncategorized')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedGroup === 'uncategorized'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Star size={16} />
                    Uncategorized
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {uncategorizedCoins.length}
                  </span>
                </button>
              )}

              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedGroup === group.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => setSelectedGroup(group.id)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Folder size={16} />
                    {group.name}
                    <span className="text-xs bg-white/20 px-2 py-1 rounded ml-auto">
                      {group.coinIds.length}
                    </span>
                  </button>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watchlist Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : watchlistCoins.length === 0 ? (
            <div className="card text-center py-12">
              <Star className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">
                {selectedGroup === 'all' ? 'Your Watchlist is Empty' : 'No Coins in This Group'}
              </h3>
              <p className="text-gray-400 mb-6">
                Add coins from the market overview or create a new group to organize them
              </p>
              {coins.length > 0 && (
                <div className="card bg-white/5 max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-4">Top Coins (Click to Add)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {coins.slice(0, 12).map((coin: Coin) => (
                      <button
                        key={coin.id}
                        onClick={() => addToWatchlist(coin.id, selectedGroup === 'all' ? undefined : selectedGroup)}
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
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Move to Group Dropdown */}
              {selectedGroup !== 'all' && groups.length > 0 && (
                <div className="card bg-blue-500/10 border-blue-500/30">
                  <p className="text-sm text-blue-400 mb-2">
                    Select coins and use the dropdown to move them between groups
                  </p>
                </div>
              )}

              {watchlistCoins.map((coin: Coin) => (
                <div key={coin.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
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
                    <div className="flex items-center gap-3">
                      {selectedGroup !== 'all' && groups.length > 0 && (
                        <select
                          value={selectedGroup}
                          onChange={(e) => moveToGroup(coin.id, e.target.value)}
                          className="px-3 py-2 bg-black/80 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="uncategorized">Uncategorized</option>
                          {groups.map((group) => (
                            <option key={group.id} value={group.id} className="bg-black text-white">
                              {group.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => removeFromWatchlist(coin.id, selectedGroup)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
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
            <div className="card bg-white/5 mt-6">
              <h3 className="font-semibold mb-4">Add More Coins</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {coins
                  .filter((coin: Coin) => !getAllWatchlistCoinIds().includes(coin.id))
                  .slice(0, 12)
                  .map((coin: Coin) => (
                    <button
                      key={coin.id}
                      onClick={() => addToWatchlist(coin.id, selectedGroup === 'all' ? undefined : selectedGroup)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium text-sm">{coin.symbol.toUpperCase()}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
