import axios from 'axios'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data'

// Create axios instance with better error handling
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
})

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
}

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  image?: string
  categories?: string
  tags?: string
}

export interface PumpDumpAlert {
  coin: Coin
  riskScore: number
  indicators: {
    volumeSpike: number
    priceSurge: number
    marketCapChange: number
    volumeToMarketCapRatio: number
    socialMentions?: number
  }
  timestamp: Date
}

export const fetchTopCoins = async (limit: number = 10): Promise<Coin[]> => {
  try {
    // Use Next.js API route to avoid CORS issues
    const response = await fetch(`/api/coins?limit=${limit}`, {
      cache: 'no-store', // Always get fresh data
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API error:', response.status, errorData)
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
    
    if (data.error) {
      console.error('API error:', data.error)
      throw new Error(data.error)
    }
    
    return []
  } catch (error: any) {
    console.error('Error fetching coins:', error?.message || error)
    // Re-throw error so SWR can handle it properly
    throw error
  }
}

export const searchCoins = async (query: string): Promise<Coin[]> => {
  try {
    if (!query || query.length < 2) {
      return []
    }

    const response = await fetch(`/api/coins/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Search API error:', response.status, errorData)
      return []
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      return data
    }

    return []
  } catch (error: any) {
    console.error('Error searching coins:', error?.message || error)
    return []
  }
}

export const fetchCoinHistory = async (
  coinId: string,
  days: number = 7
): Promise<number[][]> => {
  try {
    // Use Next.js API route to avoid CORS issues
    const response = await fetch(`/api/coins/${coinId}/history?days=${days}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('History API error:', response.status, errorData)
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && data.prices && Array.isArray(data.prices)) {
      return data.prices
    }
    
    return []
  } catch (error: any) {
    console.error('Error fetching coin history:', error?.message || error)
    throw error
  }
}

export const detectPumpAndDump = (coins: Coin[]): PumpDumpAlert[] => {
  const alerts: PumpDumpAlert[] = []

  coins.forEach((coin) => {
    // Calculate risk indicators
    const volumeSpike = calculateVolumeSpike(coin)
    const priceSurge = Math.abs(coin.price_change_percentage_24h || 0)
    const marketCapChange = Math.abs(
      coin.market_cap_change_percentage_24h || 0
    )
    const volumeToMarketCapRatio =
      coin.total_volume > 0 && coin.market_cap > 0
        ? coin.total_volume / coin.market_cap
        : 0

    // Risk scoring algorithm
    let riskScore = 0

    // High volume spike (suspicious)
    if (volumeSpike > 500) riskScore += 30
    else if (volumeSpike > 300) riskScore += 20
    else if (volumeSpike > 200) riskScore += 10

    // Extreme price surge
    if (priceSurge > 100) riskScore += 25
    else if (priceSurge > 50) riskScore += 15
    else if (priceSurge > 25) riskScore += 10

    // Market cap manipulation
    if (marketCapChange > 100) riskScore += 20
    else if (marketCapChange > 50) riskScore += 10

    // High volume relative to market cap (low liquidity)
    if (volumeToMarketCapRatio > 0.5) riskScore += 15
    else if (volumeToMarketCapRatio > 0.3) riskScore += 10
    else if (volumeToMarketCapRatio > 0.2) riskScore += 5

    // Small market cap coins are more susceptible
    if (coin.market_cap < 10000000) riskScore += 10
    else if (coin.market_cap < 50000000) riskScore += 5

    // Lower threshold to show more alerts (for demo purposes)
    // Only flag coins with significant risk
    if (riskScore >= 20) {
      alerts.push({
        coin,
        riskScore,
        indicators: {
          volumeSpike,
          priceSurge,
          marketCapChange,
          volumeToMarketCapRatio,
        },
        timestamp: new Date(),
      })
    }
  })

  // Sort by risk score (highest first)
  return alerts.sort((a, b) => b.riskScore - a.riskScore)
}

const calculateVolumeSpike = (coin: Coin): number => {
  // Estimate volume spike based on current volume and market cap
  // This is a simplified calculation - in production, you'd compare to historical averages
  if (!coin.total_volume || !coin.market_cap) return 0

  const avgVolumeRatio = 0.05 // Average daily volume is ~5% of market cap
  const expectedVolume = coin.market_cap * avgVolumeRatio
  const actualVolume = coin.total_volume

  if (expectedVolume === 0) return 0

  // Return percentage increase
  return ((actualVolume - expectedVolume) / expectedVolume) * 100
}

export const fetchCryptoNews = async (limit: number = 10): Promise<NewsArticle[]> => {
  try {
    // Using CryptoCompare News API
    const response = await apiClient.get(
      `${CRYPTOCOMPARE_API}/v2/news/`,
      {
        params: {
          lang: 'EN',
        },
      }
    )
    
    if (response.data && response.data.Data && Array.isArray(response.data.Data)) {
      return response.data.Data.slice(0, limit).map((article: any, index: number) => ({
        id: article.id?.toString() || `news-${index}`,
        title: article.title || 'Untitled',
        description: article.body || article.title || '',
        url: article.url || article.guid || '#',
        publishedAt: new Date(article.published_on * 1000).toISOString(),
        source: article.source || 'Unknown',
        image: article.imageurl || undefined,
        categories: article.categories,
        tags: article.tags,
      }))
    }
    return []
  } catch (error: any) {
    console.error('Error fetching news:', error?.message || error)
    // Fallback to empty array
    return []
  }
}

