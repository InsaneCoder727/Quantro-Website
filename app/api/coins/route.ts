import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    // Ensure limit is a valid integer
    const limitParam = searchParams.get('limit') || '30'
    const limit = Math.max(1, Math.min(parseInt(limitParam, 10) || 30, 250))

    // Fetch from CoinGecko API - ensure per_page is an integer
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
    
    const response = await fetch(url, {
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
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        })
      }
    }
    
    // If request fails, log and return error
    const errorText = await response.text().catch(() => 'Unknown error')
    console.error(`CoinGecko API error ${response.status}:`, errorText)
    
    return NextResponse.json(
      { error: `API error: ${response.status}`, details: errorText },
      { status: response.status }
    )
  } catch (error: any) {
    console.error('Error in coins route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coins' },
      { status: 500 }
    )
  }
}
