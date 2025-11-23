'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import useSWR from 'swr'
import { fetchTopCoins, Coin } from '@/lib/api'

interface Holding {
  coinId: string
  amount: number
  buyPrice: number
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHolding, setNewHolding] = useState({
    coinId: '',
    amount: '',
    buyPrice: '',
  })

  const { data: coins = [], isLoading: coinsLoading } = useSWR('top-coins-30', () => fetchTopCoins(30), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('portfolio')
    if (saved) {
      setHoldings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage
    if (holdings.length > 0) {
      localStorage.setItem('portfolio', JSON.stringify(holdings))
    }
  }, [holdings])

  const addHolding = () => {
    if (newHolding.coinId && newHolding.amount && newHolding.buyPrice) {
      setHoldings([
        ...holdings,
        {
          coinId: newHolding.coinId,
          amount: parseFloat(newHolding.amount),
          buyPrice: parseFloat(newHolding.buyPrice),
        },
      ])
      setNewHolding({ coinId: '', amount: '', buyPrice: '' })
      setShowAddForm(false)
    }
  }

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index))
  }

  const calculatePortfolio = () => {
    let totalValue = 0
    let totalCost = 0

    holdings.forEach((holding) => {
      const coin = coins.find((c: Coin) => c.id === holding.coinId)
      if (coin) {
        const currentValue = holding.amount * coin.current_price
        const cost = holding.amount * holding.buyPrice
        totalValue += currentValue
        totalCost += cost
      }
    })

    const profit = totalValue - totalCost
    const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0

    return { totalValue, totalCost, profit, profitPercent }
  }

  const portfolio = calculatePortfolio()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-gray-400">Track your cryptocurrency holdings</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Holding
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-gray-400 text-sm mb-2">Total Value</div>
          <div className="text-2xl font-bold">
            ${portfolio.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm mb-2">Total Cost</div>
          <div className="text-2xl font-bold">
            ${portfolio.totalCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm mb-2">Profit/Loss</div>
          <div
            className={`text-2xl font-bold flex items-center gap-2 ${
              portfolio.profit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {portfolio.profit >= 0 ? (
              <TrendingUp size={24} />
            ) : (
              <TrendingDown size={24} />
            )}
            ${Math.abs(portfolio.profit).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            ({portfolio.profitPercent >= 0 ? '+' : ''}
            {portfolio.profitPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card bg-white/5">
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
                <option value="">{coinsLoading ? 'Loading coins...' : coins.length === 0 ? 'No coins available' : 'Select coin'}</option>
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

      {/* Holdings List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Your Holdings</h2>
        {holdings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No holdings yet. Add your first holding to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {holdings.map((holding, index) => {
              const coin = coins.find((c: Coin) => c.id === holding.coinId)
              if (!coin) return null

              const currentValue = holding.amount * coin.current_price
              const cost = holding.amount * holding.buyPrice
              const profit = currentValue - cost
              const profitPercent = (profit / cost) * 100

              return (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{coin.name}</div>
                      <div className="text-sm text-gray-400">
                        {holding.amount} {coin.symbol.toUpperCase()} @ $
                        {holding.buyPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${currentValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div
                        className={`text-sm flex items-center gap-1 ${
                          profit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {profit >= 0 ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {profitPercent >= 0 ? '+' : ''}
                        {profitPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHolding(index)}
                    className="ml-4 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

