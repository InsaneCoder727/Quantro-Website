'use client'

import { Newspaper, ExternalLink, Clock } from 'lucide-react'
import useSWR from 'swr'
import { fetchCryptoNews, NewsArticle } from '@/lib/api'

export default function NewsFeed() {
  const { data: news = [], isLoading } = useSWR('crypto-news', () => fetchCryptoNews(20), {
    refreshInterval: 300000, // Refresh every 5 minutes
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Newspaper className="text-blue-500" size={32} />
            Crypto News
          </h1>
          <p className="text-gray-400">Latest cryptocurrency and blockchain news</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

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

      {news.length === 0 ? (
        <div className="card text-center py-12">
          <Newspaper className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2">No News Available</h3>
          <p className="text-gray-400">
            Unable to fetch news at the moment. Please try again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {news.map((newsItem) => (
          <article
            key={newsItem.id}
            className="card hover:bg-white/15 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {newsItem.image && (
                <div className="md:w-64 md:flex-shrink-0">
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-48 md:h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span className="font-medium">{newsItem.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatTimeAgo(newsItem.publishedAt)}
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">
                  {newsItem.title}
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {newsItem.description.substring(0, 200)}...
                </p>
                <a
                  href={newsItem.url}
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
      )}
    </div>
  )
}

