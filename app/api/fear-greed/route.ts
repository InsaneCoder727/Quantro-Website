import { NextRequest, NextResponse } from 'next/server'

const FEAR_GREED_API = 'https://api.alternative.me/fng/'

// Route segment config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Fetch Fear & Greed Index from alternative.me API
    const url = `${FEAR_GREED_API}?limit=30`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'no-store', // Force fresh data
    })

    if (response.ok) {
      const data = await response.json()
      
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const currentData = data.data[0]
        const historicalData = data.data.slice(1, 30).map((item: any) => ({
          value: parseInt(item.value) || 0,
          timestamp: parseInt(item.timestamp) || Date.now(),
        }))
        
        // Calculate average and trend
        const values = historicalData.map((d: any) => d.value)
        const average = values.reduce((a: number, b: number) => a + b, 0) / values.length
        const trend = (parseInt(currentData.value) - average) > 0 ? 'increasing' : 'decreasing'
        
        return NextResponse.json({
          value: parseInt(currentData.value) || 0,
          valueClassification: currentData.value_classification || 'Neutral',
          timestamp: parseInt(currentData.timestamp) || Date.now(),
          historical: historicalData,
          average: Math.round(average),
          trend,
          change: Math.round(parseInt(currentData.value) - average),
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
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

