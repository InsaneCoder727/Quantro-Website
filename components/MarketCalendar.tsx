'use client'

import { useState, useMemo } from 'react'
import { Calendar, CalendarClock, TrendingUp, AlertCircle, Info, Filter } from 'lucide-react'

interface CalendarEvent {
  id: string
  date: string
  type: 'unlock' | 'listing' | 'delisting' | 'event' | 'announcement'
  title: string
  description: string
  coin?: string
  impact: 'high' | 'medium' | 'low'
}

export default function MarketCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterType, setFilterType] = useState<string>('all')
  const [filterImpact, setFilterImpact] = useState<string>('all')

  // Mock calendar events - In production, this would come from an API
  const events: CalendarEvent[] = useMemo(() => {
    const today = new Date()
    const events: CalendarEvent[] = []
    
    // Generate some sample events for the current month and next month
    const currentMonth = selectedMonth
    const currentYear = selectedYear
    
    // Add some token unlocks
    events.push({
      id: '1',
      date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0],
      type: 'unlock',
      title: 'Token Unlock: Major Altcoin',
      description: 'Large token unlock event scheduled',
      coin: 'ALT',
      impact: 'high',
    })
    
    events.push({
      id: '2',
      date: new Date(currentYear, currentMonth, 12).toISOString().split('T')[0],
      type: 'listing',
      title: 'New Exchange Listing',
      description: 'Top 10 coin listing on major exchange',
      impact: 'medium',
    })
    
    events.push({
      id: '3',
      date: new Date(currentYear, currentMonth, 18).toISOString().split('T')[0],
      type: 'event',
      title: 'Fed Interest Rate Decision',
      description: 'Federal Reserve interest rate announcement',
      impact: 'high',
    })
    
    events.push({
      id: '4',
      date: new Date(currentYear, currentMonth, 25).toISOString().split('T')[0],
      type: 'announcement',
      title: 'Major Protocol Update',
      description: 'Major blockchain protocol upgrade scheduled',
      impact: 'medium',
    })
    
    // Add events for next month
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
    
    events.push({
      id: '5',
      date: new Date(nextYear, nextMonth, 3).toISOString().split('T')[0],
      type: 'unlock',
      title: 'Token Unlock: DeFi Token',
      description: 'DeFi protocol token unlock',
      coin: 'DEFI',
      impact: 'medium',
    })
    
    return events
  }, [selectedMonth, selectedYear])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      const matchesMonth = eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear
      
      if (!matchesMonth) return false
      
      if (filterType !== 'all' && event.type !== filterType) return false
      if (filterImpact !== 'all' && event.impact !== filterImpact) return false
      
      return true
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [events, selectedMonth, selectedYear, filterType, filterImpact])

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'unlock':
        return <AlertCircle className="text-orange-400" size={20} />
      case 'listing':
        return <TrendingUp className="text-green-400" size={20} />
      case 'delisting':
        return <TrendingUp className="text-red-400 rotate-180" size={20} />
      case 'event':
        return <CalendarClock className="text-blue-400" size={20} />
      case 'announcement':
        return <Info className="text-purple-400" size={20} />
      default:
        return <Calendar className="text-gray-400" size={20} />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'unlock':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-400'
      case 'listing':
        return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'delisting':
        return 'bg-red-500/20 border-red-500/50 text-red-400'
      case 'event':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      case 'announcement':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-400'
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0))
  ).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Calendar className="text-blue-500" size={32} />
          Market Calendar
        </h1>
        <p className="text-gray-400">Track upcoming events, listings, and token unlocks</p>
      </div>

      {/* Filters and Navigation */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              ← Prev
            </button>
            <h2 className="text-2xl font-bold text-white min-w-[200px] text-center">
              {monthNames[selectedMonth]} {selectedYear}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Types</option>
              <option value="unlock">Token Unlocks</option>
              <option value="listing">Listings</option>
              <option value="delisting">Delistings</option>
              <option value="event">Events</option>
              <option value="announcement">Announcements</option>
            </select>
            <select
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value)}
              className="px-4 py-2 bg-black/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-black [&>option]:text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="all">All Impact</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </div>

        {/* Upcoming Events Preview */}
        {upcomingEvents.length > 0 && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <CalendarClock className="text-blue-400" size={20} />
              Upcoming This Month
            </h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 min-w-[80px]">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${getEventTypeColor(event.type)}`}>
                    {event.type.toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{event.title}</span>
                  {event.coin && (
                    <span className="text-gray-400">({event.coin})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-2 ${getEventTypeColor(event.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getEventTypeIcon(event.type)}
                    <div>
                      <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                      {event.coin && (
                        <span className="text-sm text-gray-300">Coin: {event.coin}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white mb-1">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className={`text-xs font-semibold ${getImpactColor(event.impact)}`}>
                      {event.impact.toUpperCase()} IMPACT
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-2">{event.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
              <p>No events found for this month.</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or select a different month.</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-white/5">
        <h3 className="font-semibold mb-4">Event Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-orange-400" size={16} />
            <span className="text-gray-300">Token Unlock</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-400" size={16} />
            <span className="text-gray-300">Exchange Listing</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-red-400 rotate-180" size={16} />
            <span className="text-gray-300">Delisting</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="text-blue-400" size={16} />
            <span className="text-gray-300">Market Event</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="text-purple-400" size={16} />
            <span className="text-gray-300">Announcement</span>
          </div>
        </div>
      </div>
    </div>
  )
}

