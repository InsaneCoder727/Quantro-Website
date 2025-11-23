import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ coinId: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')
    const params = await context.params
    const coinId = params.coinId

    // Fetch real data from CoinGecko
    const url = `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      next: {
        revalidate: 300,
      },
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data.prices && Array.isArray(data.prices)) {
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        })
      }
    }

    // Return error if API fails
    return NextResponse.json(
      { error: `API error: ${response.status}` },
      { status: response.status }
    )
  } catch (error: any) {
    console.error('Error fetching coin history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch coin history' },
      { status: 500 }
    )
  }
}
