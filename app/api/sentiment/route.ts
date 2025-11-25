import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

// Route segment config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Fetch Bitcoin dominance and global market data
    const [globalResponse, bitcoinResponse] = await Promise.all([
      fetch(`${COINGECKO_API}/global`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      }),
      fetch(`${COINGECKO_API}/coins/bitcoin`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      }),
    ])

    const globalData = await globalResponse.json().catch(() => null)
    const bitcoinData = await bitcoinResponse.json().catch(() => null)

    if (globalData && bitcoinData) {
      const totalMarketCap = globalData.data?.total_market_cap?.usd || 0
      const bitcoinMarketCap = bitcoinData.market_data?.market_cap?.usd || 0
      const bitcoinDominance = totalMarketCap > 0 ? (bitcoinMarketCap / totalMarketCap) * 100 : 0

      return NextResponse.json({
        bitcoinDominance: Math.round(bitcoinDominance * 100) / 100,
        totalMarketCap,
        bitcoinMarketCap,
        marketCapChange24h: globalData.data?.market_cap_change_percentage_24h_usd || 0,
        activeCryptocurrencies: globalData.data?.active_cryptocurrencies || 0,
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Error fetching sentiment data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sentiment data' },
      { status: 500 }
    )
  }
}

