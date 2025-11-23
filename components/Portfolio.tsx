'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, Download, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'
import useSWR from 'swr'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { fetchTopCoins, Coin } from '@/lib/api'

interface Holding {
  id: string
  coinId: string
  amount: number
  buyPrice: number
  buyDate?: string
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHolding, setNewHolding] = useState({
    coinId: '',
    amount: '',
    buyPrice: '',
  })
  const [activeTab, setActiveTab] = useState<'holdings' | 'analytics' | 'allocation'>('holdings')

  const { data: coins = [], isLoading: coinsLoading } = useSWR('top-coins-250', () => fetchTopCoins(250), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem('portfolio')
    if (saved) {
      const data = JSON.parse(saved)
      // Migrate old format to new format with IDs
      const migrated = data.map((h: any, idx: number) => ({
        ...h,
        id: h.id || `holding-${idx}-${Date.now()}`,
      }))
      setHoldings(migrated)
    }
  }, [])

  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('portfolio', JSON.stringify(holdings))
    } else {
      localStorage.removeItem('portfolio')
    }
  }, [holdings])

  const portfolioData = useMemo(() => {
    let totalValue = 0
    let totalCost = 0
    const holdingsWithData: Array<Holding & {
      coin?: Coin
      currentValue: number
      profit: number
      profitPercent: number
      allocation: number
    }> = []

    holdings.forEach((holding) => {
      const coin = coins.find((c: Coin) => c.id === holding.coinId)
      if (coin) {
        const currentValue = holding.amount * coin.current_price
        const cost = holding.amount * holding.buyPrice
        totalValue += currentValue
        totalCost += cost
        holdingsWithData.push({
          ...holding,
          coin,
          currentValue,
          profit: currentValue - cost,
          profitPercent: (currentValue - cost) / cost * 100,
          allocation: 0, // Will calculate after
        })
      }
    })

    // Calculate allocation percentage
    holdingsWithData.forEach((h) => {
      h.allocation = totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0
    })

    const profit = totalValue - totalCost
    const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0

    // Sort by value
    holdingsWithData.sort((a, b) => b.currentValue - a.currentValue)

    return { totalValue, totalCost, profit, profitPercent, holdingsWithData }
  }, [holdings, coins])

  const addHolding = () => {
    if (newHolding.coinId && newHolding.amount && newHolding.buyPrice) {
      setHoldings([
        ...holdings,
        {
          id: `holding-${Date.now()}`,
          coinId: newHolding.coinId,
          amount: parseFloat(newHolding.amount),
          buyPrice: parseFloat(newHolding.buyPrice),
          buyDate: new Date().toISOString(),
        },
      ])
      setNewHolding({ coinId: '', amount: '', buyPrice: '' })
      setShowAddForm(false)
    }
  }

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter((h) => h.id !== id))
  }

  const exportPortfolio = () => {
    const csv = [
      ['Coin', 'Amount', 'Buy Price', 'Current Price', 'Value', 'Profit/Loss', 'Profit %'].join(','),
      ...portfolioData.holdingsWithData.map((h) =>
        [
          h.coin?.name || 'Unknown',
          h.amount,
          h.buyPrice,
          h.coin?.current_price || 0,
          h.currentValue,
          h.profit,
          h.profitPercent.toFixed(2),
        ].join(',')
      ),
      ['', '', '', '', portfolioData.totalValue, portfolioData.profit, portfolioData.profitPercent.toFixed(2)].join(','),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quantro-portfolio-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  // Asset allocation data for pie chart
  const allocationData = portfolioData.holdingsWithData
    .slice(0, 8)
    .map((h, idx) => ({
      name: h.coin?.symbol.toUpperCase() || 'Unknown',
      value: h.allocation,
      color: chartColors[idx % chartColors.length],
    }))

  // Performance data for bar chart
  const performanceData = portfolioData.holdingsWithData
    .slice(0, 10)
    .map((h) => ({
      name: h.coin?.symbol.toUpperCase() || 'Unknown',
      profit: h.profit,
      value: h.currentValue,
    }))

  const topGainers = portfolioData.holdingsWithData
    .filter((h) => h.profit > 0)
    .sort((a, b) => b.profitPercent - a.profitPercent)
    .slice(0, 5)

  const topLosers = portfolioData.holdingsWithData
    .filter((h) => h.profit < 0)
    .sort((a, b) => a.profitPercent - b.profitPercent)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-gray-400">Track and analyze your cryptocurrency holdings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportPortfolio}
            disabled={portfolioData.holdingsWithData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            <Download size={20} />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add Holding
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up">
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="text-gray-400 text-sm mb-2">Total Value</div>
          <div className="text-2xl font-bold">
            ${portfolioData.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="text-gray-400 text-sm mb-2">Total Cost</div>
          <div className="text-2xl font-bold">
            ${portfolioData.totalCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="text-gray-400 text-sm mb-2">Profit/Loss</div>
          <div
            className={`text-2xl font-bold flex items-center gap-2 ${
              portfolioData.profit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {portfolioData.profit >= 0 ? (
              <TrendingUp size={24} />
            ) : (
              <TrendingDown size={24} />
            )}
            ${Math.abs(portfolioData.profit).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div
            className={`text-sm mt-1 ${
              portfolioData.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {portfolioData.profitPercent >= 0 ? '+' : ''}
            {portfolioData.profitPercent.toFixed(2)}%
          </div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm mb-2">Holdings</div>
          <div className="text-2xl font-bold">{portfolioData.holdingsWithData.length}</div>
          <div className="text-sm text-gray-400 mt-1">Active positions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'holdings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Holdings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('allocation')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'allocation'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Allocation
          </button>
        </div>

        {/* Holdings Tab */}
        {activeTab === 'holdings' && (
          <div>
            {showAddForm && (
              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold mb-4">Add New Holding</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Coin
                    </label>
                    <select
                      value={newHolding.coinId}
                      onChange={(e) =>
                        setNewHolding({ ...newHolding, coinId: e.target.value })
                      }
                      disabled={coinsLoading || coins.length === 0}
                      className="w-full px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed [&>option]:bg-black [&>option]:text-white"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">
                        {coinsLoading ? 'Loading coins...' : coins.length === 0 ? 'No coins available' : 'Select coin'}
                      </option>
                      {coins.map((coin: Coin) => (
                        <option key={coin.id} value={coin.id} className="bg-black text-white">
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newHolding.amount}
                      onChange={(e) =>
                        setNewHolding({ ...newHolding, amount: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Buy Price (USD)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={newHolding.buyPrice}
                      onChange={(e) =>
                        setNewHolding({ ...newHolding, buyPrice: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={addHolding}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {portfolioData.holdingsWithData.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No holdings yet. Add your first holding to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Coin</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Amount</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Buy Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Current Price</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Profit/Loss</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Allocation</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.holdingsWithData.map((holding) => (
                      <tr
                        key={holding.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={holding.coin?.image || ''}
                              alt={holding.coin?.name || 'Unknown'}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-semibold">{holding.coin?.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-400 uppercase">
                                {holding.coin?.symbol || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">{holding.amount.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right">
                          ${holding.buyPrice.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          ${holding.coin?.current_price?.toLocaleString() || '-'}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold">
                          ${holding.currentValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-semibold ${
                            holding.profit >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {holding.profit >= 0 ? (
                              <TrendingUp size={16} />
                            ) : (
                              <TrendingDown size={16} />
                            )}
                            {holding.profit >= 0 ? '+' : ''}
                            {holding.profit.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            <span className="text-sm ml-1">
                              ({holding.profitPercent >= 0 ? '+' : ''}
                              {holding.profitPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-gray-300">
                          {holding.allocation.toFixed(1)}%
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => removeHolding(holding.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Gainers/Losers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-400" size={20} />
                  Top Gainers
                </h3>
                {topGainers.length > 0 ? (
                  <div className="space-y-3">
                    {topGainers.map((holding) => (
                      <div
                        key={holding.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={holding.coin?.image || ''}
                            alt={holding.coin?.name || 'Unknown'}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">{holding.coin?.symbol.toUpperCase()}</div>
                            <div className="text-xs text-gray-400">{holding.coin?.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">
                            +{holding.profitPercent.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            +${holding.profit.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No gainers in your portfolio</p>
                )}
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingDown className="text-red-400" size={20} />
                  Top Losers
                </h3>
                {topLosers.length > 0 ? (
                  <div className="space-y-3">
                    {topLosers.map((holding) => (
                      <div
                        key={holding.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={holding.coin?.image || ''}
                            alt={holding.coin?.name || 'Unknown'}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">{holding.coin?.symbol.toUpperCase()}</div>
                            <div className="text-xs text-gray-400">{holding.coin?.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-400 font-semibold">
                            {holding.profitPercent.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            ${holding.profit.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No losers in your portfolio</p>
                )}
              </div>
            </div>

            {/* Performance Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-400" size={20} />
                Top Holdings by Value
              </h3>
              <div className="h-80">
                {performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#3B82F6" name="Value (USD)" />
                      <Bar dataKey="profit" fill="#10B981" name="Profit (USD)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Allocation Tab */}
        {activeTab === 'allocation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChartIcon className="text-purple-400" size={20} />
                  Asset Allocation
                </h3>
                <div className="h-80">
                  {allocationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No holdings to display
                    </div>
                  )}
                </div>
              </div>

              {/* Allocation List */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Allocation Details</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {portfolioData.holdingsWithData
                    .sort((a, b) => b.allocation - a.allocation)
                    .map((holding, idx) => (
                      <div key={holding.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-semibold">{holding.coin?.symbol.toUpperCase()}</div>
                            <div className="text-xs text-gray-400">{holding.coin?.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{holding.allocation.toFixed(1)}%</div>
                          <div className="text-xs text-gray-400">
                            ${holding.currentValue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
