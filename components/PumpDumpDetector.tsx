'use client'

import { useEffect, useState, useMemo } from 'react'
import useSWR from 'swr'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3,
  Info,
  Filter,
  ArrowUpDown,
  Zap,
  Shield,
  TrendingDown as TrendingDownIcon,
  Calendar
} from 'lucide-react'
import { fetchTopCoins, detectPumpAndDump, PumpDumpAlert } from '@/lib/api'

type SortOption = 'risk' | 'price' | 'volume' | 'change' | 'marketCap'
type FilterOption = 'all' | 'high' | 'medium' | 'critical'

export default function PumpDumpDetector() {
  const [sortBy, setSortBy] = useState<SortOption>('risk')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const { data: coins = [], isLoading, error } = useSWR('top-coins-30', () => fetchTopCoins(30), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
    errorRetryCount: 3,
    errorRetryInterval: 2000,
  })

  const [alerts, setAlerts] = useState<PumpDumpAlert[]>([])

  useEffect(() => {
    if (coins.length > 0) {
      const detectedAlerts = detectPumpAndDump(coins)
      setAlerts(detectedAlerts)
    }
  }, [coins])

  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = alerts

    // Filter by risk level
    if (filterBy === 'critical') {
      filtered = filtered.filter(a => a.riskScore >= 70)
    } else if (filterBy === 'high') {
      filtered = filtered.filter(a => a.riskScore >= 50 && a.riskScore < 70)
    } else if (filterBy === 'medium') {
      filtered = filtered.filter(a => a.riskScore >= 20 && a.riskScore < 50)
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          return b.riskScore - a.riskScore
        case 'price':
          return (b.coin.current_price || 0) - (a.coin.current_price || 0)
        case 'volume':
          return (b.coin.total_volume || 0) - (a.coin.total_volume || 0)
        case 'change':
          return Math.abs(b.coin.price_change_percentage_24h || 0) - Math.abs(a.coin.price_change_percentage_24h || 0)
        case 'marketCap':
          return (b.coin.market_cap || 0) - (a.coin.market_cap || 0)
        default:
          return 0
      }
    })

    return sorted
  }, [alerts, sortBy, filterBy])

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-500/20 border-red-500/50'
    if (score >= 50) return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
    return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'CRITICAL RISK'
    if (score >= 50) return 'HIGH RISK'
    return 'MEDIUM RISK'
  }

  const getRiskIcon = (score: number) => {
    if (score >= 70) return <AlertTriangle className="text-red-400" size={24} />
    if (score >= 50) return <Zap className="text-orange-400" size={24} />
    return <Shield className="text-yellow-400" size={24} />
  }

  const criticalAlerts = alerts.filter(a => a.riskScore >= 70).length
  const highAlerts = alerts.filter(a => a.riskScore >= 50 && a.riskScore < 70).length
  const mediumAlerts = alerts.filter(a => a.riskScore >= 20 && a.riskScore < 50).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={32} />
            Pump & Dump Detection
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive real-time analysis of suspicious market activity
          </p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={32} />
            Pump & Dump Detection
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive real-time analysis of suspicious market activity
          </p>
        </div>
        <div className="card text-center py-12 bg-yellow-500/10 border-yellow-500/30">
          <p className="text-yellow-400 mb-4">Unable to load data</p>
          <p className="text-sm text-gray-400">Please check your connection and try again.</p>
        </div>
      </div>
    )
  }

  if (coins.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={32} />
            Pump & Dump Detection
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive real-time analysis of suspicious market activity
          </p>
        </div>
        <div className="card text-center py-12">
          <AlertTriangle className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">Unable to Load Data</h3>
          <p className="text-gray-400">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={32} />
            Pump & Dump Detection
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive real-time analysis of suspicious market activity
          </p>
        </div>
        
        {/* Alert Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center bg-red-500/10 border-red-500/30">
            <div className="text-sm text-gray-400 mb-1">Critical</div>
            <div className="text-2xl font-bold text-red-400">{criticalAlerts}</div>
          </div>
          <div className="card text-center bg-orange-500/10 border-orange-500/30">
            <div className="text-sm text-gray-400 mb-1">High</div>
            <div className="text-2xl font-bold text-orange-400">{highAlerts}</div>
          </div>
          <div className="card text-center bg-yellow-500/10 border-yellow-500/30">
            <div className="text-sm text-gray-400 mb-1">Medium</div>
            <div className="text-2xl font-bold text-yellow-400">{mediumAlerts}</div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <span className="text-gray-400 font-medium">Filter:</span>
            <div className="flex gap-2">
              {(['all', 'critical', 'high', 'medium'] as FilterOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterBy(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterBy === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-gray-400" />
            <span className="text-gray-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="risk">Risk Score</option>
              <option value="price">Price</option>
              <option value="volume">Volume</option>
              <option value="change">Price Change</option>
              <option value="marketCap">Market Cap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAndSortedAlerts.length === 0 ? (
        <div className="card text-center py-12">
          <AlertTriangle className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No Alerts Detected</h3>
          <p className="text-gray-400">
            {filterBy === 'all' 
              ? 'The market appears stable. No pump-and-dump patterns detected.'
              : `No ${filterBy} risk alerts found. Try adjusting your filters.`
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Analyzed {coins.length} coins. Lower threshold coins may show alerts.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedAlerts.map((alert, index) => (
            <div
              key={`${alert.coin.id}-${index}`}
              className={`card border-2 ${getRiskColor(alert.riskScore)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={alert.coin.image}
                    alt={alert.coin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{alert.coin.name}</h3>
                    <p className="text-gray-400 text-sm uppercase">
                      {alert.coin.symbol} • Rank #{alert.coin.market_cap_rank}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    {getRiskIcon(alert.riskScore)}
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(
                        alert.riskScore
                      )}`}
                    >
                      {getRiskLabel(alert.riskScore)}
                    </div>
                  </div>
                  <div className="text-3xl font-bold">
                    Risk: {alert.riskScore}%
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <TrendingUp size={16} />
                    Price Change
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      (alert.coin.price_change_percentage_24h || 0) > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {(alert.coin.price_change_percentage_24h || 0) > 0 ? '+' : ''}
                    {alert.coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ${alert.coin.current_price?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Activity size={16} />
                    Volume Spike
                  </div>
                  <div className="text-lg font-semibold text-orange-400">
                    +{alert.indicators.volumeSpike.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Unusual volume
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <BarChart3 size={16} />
                    24h Volume
                  </div>
                  <div className="text-lg font-semibold">
                    ${(alert.coin.total_volume / 1e6).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((alert.coin.total_volume / alert.coin.market_cap) * 100).toFixed(1)}% of market cap
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign size={16} />
                    Market Cap
                  </div>
                  <div className="text-lg font-semibold">
                    ${(alert.coin.market_cap / 1e9).toFixed(2)}B
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {alert.coin.market_cap < 10000000 ? 'Very Small' : 
                     alert.coin.market_cap < 50000000 ? 'Small' : 'Medium'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <TrendingDownIcon size={16} />
                    Market Cap Change
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      (alert.coin.market_cap_change_percentage_24h || 0) > 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {(alert.coin.market_cap_change_percentage_24h || 0) > 0 ? '+' : ''}
                    {alert.coin.market_cap_change_percentage_24h?.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    24h change
                  </div>
                </div>
              </div>

              {/* Risk Breakdown */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Risk Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Volume Spike</div>
                    <div className="text-sm font-semibold text-orange-400">
                      {alert.indicators.volumeSpike > 500 ? 'Critical' :
                       alert.indicators.volumeSpike > 300 ? 'High' :
                       alert.indicators.volumeSpike > 200 ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {alert.indicators.volumeSpike.toFixed(0)}% spike
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Price Surge</div>
                    <div className="text-sm font-semibold text-red-400">
                      {Math.abs(alert.indicators.priceSurge) > 100 ? 'Critical' :
                       Math.abs(alert.indicators.priceSurge) > 50 ? 'High' :
                       Math.abs(alert.indicators.priceSurge) > 25 ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {alert.indicators.priceSurge.toFixed(1)}% change
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Market Cap Volatility</div>
                    <div className="text-sm font-semibold text-yellow-400">
                      {Math.abs(alert.indicators.marketCapChange) > 100 ? 'Critical' :
                       Math.abs(alert.indicators.marketCapChange) > 50 ? 'High' :
                       Math.abs(alert.indicators.marketCapChange) > 25 ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {alert.indicators.marketCapChange.toFixed(1)}% change
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Volume Ratio</div>
                    <div className="text-sm font-semibold text-blue-400">
                      {alert.indicators.volumeToMarketCapRatio > 0.5 ? 'Critical' :
                       alert.indicators.volumeToMarketCapRatio > 0.3 ? 'High' :
                       alert.indicators.volumeToMarketCapRatio > 0.2 ? 'Medium' : 'Low'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(alert.indicators.volumeToMarketCapRatio * 100).toFixed(1)}% ratio
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Details */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowDetails(showDetails === alert.coin.id ? null : alert.coin.id)}
                  className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info size={16} />
                    {showDetails === alert.coin.id ? 'Hide Details' : 'Show Details'}
                  </span>
                  <Calendar size={16} />
                </button>
                {showDetails === alert.coin.id && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h High:</span>
                      <span className="text-white">${alert.coin.high_24h?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Low:</span>
                      <span className="text-white">${alert.coin.low_24h?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price Range:</span>
                      <span className="text-white">
                        {((((alert.coin.high_24h || 0) - (alert.coin.low_24h || 0)) / (alert.coin.low_24h || 1)) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Alert Time:</span>
                      <span className="text-white">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Card */}
      <div className="card bg-blue-500/10 border-blue-500/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Info size={20} />
          How It Works
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          Our comprehensive algorithm analyzes multiple risk indicators including volume spikes, price surges, 
          market cap volatility, and volume-to-market-cap ratios to identify potential pump-and-dump schemes. 
          The risk score combines these factors to provide an overall risk assessment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Risk Indicators:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Volume Spike: Unusual trading volume increases</li>
              <li>• Price Surge: Extreme price movements</li>
              <li>• Market Cap Volatility: Rapid market cap changes</li>
              <li>• Volume Ratio: Volume relative to market cap</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Risk Levels:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <span className="text-red-400">Critical (70-100)</span>: High manipulation risk</li>
              <li>• <span className="text-orange-400">High (50-69)</span>: Significant risk factors</li>
              <li>• <span className="text-yellow-400">Medium (20-49)</span>: Moderate concerns</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">
          Always conduct your own research before making investment decisions. This tool is for informational purposes only.
        </p>
      </div>
    </div>
  )
}
