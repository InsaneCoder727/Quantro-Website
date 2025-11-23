'use client'

import { Newspaper, ExternalLink, Clock } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  image?: string
}

// Mock news data - In production, integrate with CryptoCompare, NewsAPI, or similar
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin Reaches New All-Time High',
    description:
      'Bitcoin continues its bullish momentum, reaching unprecedented heights as institutional adoption increases.',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: 'CryptoNews',
    image: 'https://via.placeholder.com/400x200?text=Bitcoin+News',
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Upgrade Completes Successfully',
    description:
      'The long-awaited Ethereum upgrade brings improved scalability and reduced energy consumption.',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: 'Blockchain Today',
    image: 'https://via.placeholder.com/400x200?text=Ethereum+News',
  },
  {
    id: '3',
    title: 'New Regulations for Cryptocurrency Trading',
    description:
      'Regulators worldwide are implementing new frameworks to protect investors and ensure market stability.',
    url: '#',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: 'Financial Times',
    image: 'https://via.placeholder.com/400x200?text=Regulation+News',
  },
  {
    id: '4',
    title: 'DeFi Total Value Locked Surpasses $100 Billion',
    description:
      'Decentralized finance continues to grow as more users lock their assets in DeFi protocols.',
    url: '#',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: 'DeFi Pulse',
    image: 'https://via.placeholder.com/400x200?text=DeFi+News',
  },
  {
    id: '5',
    title: 'Major Exchange Announces New Listing',
    description:
      'A leading cryptocurrency exchange adds support for several altcoins, expanding trading options.',
    url: '#',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: 'Exchange News',
    image: 'https://via.placeholder.com/400x200?text=Exchange+News',
  },
]

export default function NewsFeed() {
  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const published = new Date(date)
    const diffMs = now.getTime() - published.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Newspaper className="text-blue-500" size={32} />
          Crypto News
        </h1>
        <p className="text-gray-400">Latest cryptocurrency and blockchain news</p>
      </div>

      <div className="grid gap-6">
        {mockNews.map((news) => (
          <article
            key={news.id}
            className="card hover:bg-white/15 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {news.image && (
                <div className="md:w-64 md:flex-shrink-0">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 md:h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span className="font-medium">{news.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatTimeAgo(news.publishedAt)}
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">
                  {news.title}
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {news.description}
                </p>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Read more
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="card bg-blue-500/10 border-blue-500/30">
        <p className="text-sm text-gray-300">
          <strong>Note:</strong> This is a demo news feed. In production, integrate
          with real news APIs like CryptoCompare, NewsAPI, or RSS feeds from major
          crypto news sources.
        </p>
      </div>
    </div>
  )
}

