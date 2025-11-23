import { NextRequest, NextResponse } from 'next/server'

const FEAR_GREED_API = 'https://api.alternative.me/fng/'

export async function GET(request: NextRequest) {
  try {
    // Fetch Fear & Greed Index from alternative.me API
    const url = `${FEAR_GREED_API}?limit=1`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (response.ok) {
      const data = await response.json()
      
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const indexData = data.data[0]
        return NextResponse.json({
          value: parseInt(indexData.value) || 0,
          valueClassification: indexData.value_classification || 'Neutral',
          timestamp: parseInt(indexData.timestamp) || Date.now(),
        }, {
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
    console.error('Error fetching Fear & Greed Index:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Fear & Greed Index' },
      { status: 500 }
    )
  }
}

