'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MarketOverview from './MarketOverview'
import PumpDumpDetector from './PumpDumpDetector'
import PriceChart from './PriceChart'
import Portfolio from './Portfolio'
import Watchlist from './Watchlist'
import NewsFeed from './NewsFeed'

type Tab = 'overview' | 'pump-dump' | 'charts' | 'portfolio' | 'watchlist' | 'news'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <MarketOverview />
      case 'pump-dump':
        return <PumpDumpDetector />
      case 'charts':
        return <PriceChart />
      case 'portfolio':
        return <Portfolio />
      case 'watchlist':
        return <Watchlist />
      case 'news':
        return <NewsFeed />
      default:
        return <MarketOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="lg:pl-64">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}

