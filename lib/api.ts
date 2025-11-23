import axios from 'axios'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

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

export const fetchTopCoins = async (limit: number = 100): Promise<Coin[]> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching coins:', error)
    return []
  }
}

export const fetchCoinHistory = async (
  coinId: string,
  days: number = 7
): Promise<number[][]> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    )
    return response.data.prices || []
  } catch (error) {
    console.error('Error fetching coin history:', error)
    return []
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

    // Only flag coins with significant risk
    if (riskScore >= 30) {
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

export const fetchCryptoNews = async () => {
  try {
    // Using CryptoCompare or NewsAPI - for now return mock data
    // In production, integrate with a real news API
    return []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

