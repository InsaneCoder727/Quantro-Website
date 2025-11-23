'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, AlertTriangle, BarChart3, Shield, Zap, Globe, Star, Quote } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Crypto Pump & Dump
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Detection Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Advanced cryptocurrency analytics with real-time pump-and-dump detection.
              Protect your investments with intelligent risk analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">$6,000+</div>
            <div className="text-gray-300">Losses Prevented</div>
            <div className="text-sm text-gray-400 mt-2">Protected our users from risky trades</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">70,000+</div>
            <div className="text-gray-300">Trades Analyzed</div>
            <div className="text-sm text-gray-400 mt-2">Real-time market analysis and insights</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">10,000+</div>
            <div className="text-gray-300">Active Users</div>
            <div className="text-sm text-gray-400 mt-2">Trusted by traders worldwide</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-300 text-lg">Everything you need to make informed crypto decisions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Pump & Dump Detection</h3>
            <p className="text-gray-300">
              Advanced algorithm identifies suspicious market activity and potential manipulation patterns in real-time.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Market Data</h3>
            <p className="text-gray-300">
              Live prices, volumes, and market caps for top cryptocurrencies updated every minute.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Charts</h3>
            <p className="text-gray-300">
              Comprehensive price history with multiple timeframes and technical indicators.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Risk Scoring</h3>
            <p className="text-gray-300">
              Intelligent risk analysis based on volume spikes, price surges, and market cap changes.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Portfolio Tracker</h3>
            <p className="text-gray-300">
              Monitor your cryptocurrency holdings with profit/loss tracking and performance analytics.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">News Feed</h3>
            <p className="text-gray-300">
              Stay updated with the latest cryptocurrency news from trusted sources.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-gray-300 text-lg">Join thousands of satisfied traders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
              ))}
            </div>
            <Quote className="text-blue-400 mb-4" size={32} />
            <p className="text-gray-300 mb-6 italic">
              "This dashboard saved me from making a huge mistake. The pump & dump detection alerted me before I lost thousands. Best investment in my crypto journey!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                AS
              </div>
              <div>
                <div className="font-semibold text-white">Alex Smith</div>
                <div className="text-sm text-gray-400">Day Trader</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
              ))}
            </div>
            <Quote className="text-blue-400 mb-4" size={32} />
            <p className="text-gray-300 mb-6 italic">
              "The real-time alerts and risk analysis have been game-changers. I can now make informed decisions with confidence. Highly recommended!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                MJ
              </div>
              <div>
                <div className="font-semibold text-white">Maria Johnson</div>
                <div className="text-sm text-gray-400">Crypto Investor</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
              ))}
            </div>
            <Quote className="text-blue-400 mb-4" size={32} />
            <p className="text-gray-300 mb-6 italic">
              "Outstanding platform! The market overview and charts are incredibly detailed. It's like having a professional analyst at your fingertips."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                RC
              </div>
              <div>
                <div className="font-semibold text-white">Robert Chen</div>
                <div className="text-sm text-gray-400">Portfolio Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="card text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">
            Join over 10,000 traders using our platform to make smarter crypto investment decisions.
            Protect your portfolio with real-time pump & dump detection.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
