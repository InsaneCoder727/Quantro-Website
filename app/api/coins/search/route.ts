import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Use CoinGecko's search endpoint
    try {
      const searchUrl = `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
      
      const response = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        next: {
          revalidate: 60,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const coinIds = data.coins?.slice(0, 50).map((coin: any) => coin.id) || []
        
        if (coinIds.length === 0) {
          return NextResponse.json([])
        }

        // Now fetch full market data for the found coins
        const idsParam = coinIds.join(',')
        const marketUrl = `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
        
        const marketResponse = await fetch(marketUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
          next: {
            revalidate: 60,
          },
        })

        if (marketResponse.ok) {
          const marketData = await marketResponse.json()
          if (Array.isArray(marketData) && marketData.length > 0) {
            return NextResponse.json(marketData, {
              headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
              },
            })
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    }

    return NextResponse.json([])
  } catch (error: any) {
    console.error('Error in search route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search coins' },
      { status: 500 }
    )
  }
}

