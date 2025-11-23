'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, AlertTriangle, BarChart3, Shield, Zap, Globe, Star, Brain, GitCompare, Bell, Grid, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Logo from '@/components/Logo'

const testimonials = [
  {
    id: 1,
    name: 'Alex Smith',
    role: 'Day Trader',
    initials: 'AS',
    gradient: 'from-blue-500 to-purple-500',
    text: '"Quantro saved me from making a huge mistake. The pump & dump detection alerted me before I lost thousands. Best investment in my crypto journey!"',
    rating: 5,
  },
  {
    id: 2,
    name: 'Maria Johnson',
    role: 'Crypto Investor',
    initials: 'MJ',
    gradient: 'from-green-500 to-emerald-500',
    text: '"The real-time alerts and risk analysis have been game-changers. I can now make informed decisions with confidence. Highly recommended!"',
    rating: 5,
  },
  {
    id: 3,
    name: 'Robert Chen',
    role: 'Portfolio Manager',
    initials: 'RC',
    gradient: 'from-purple-500 to-pink-500',
    text: '"Outstanding platform! The market overview and charts are incredibly detailed. It\'s like having a professional analyst at your fingertips."',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sarah Williams',
    role: 'Crypto Trader',
    initials: 'SW',
    gradient: 'from-orange-500 to-red-500',
    text: '"I\'ve tried many platforms, but Quantro\'s pump & dump detection is unmatched. It has saved me thousands in potential losses. Worth every penny!"',
    rating: 5,
  },
  {
    id: 5,
    name: 'David Martinez',
    role: 'Investment Advisor',
    initials: 'DM',
    gradient: 'from-cyan-500 to-blue-500',
    text: '"The sentiment analysis and market calendar features help me stay ahead of the curve. This platform is a must-have for serious traders."',
    rating: 5,
  },
]

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo size="md" showText={true} />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-semibold mb-6">
                Advanced Crypto Analytics Platform
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Protect Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Crypto Investments
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Real-time pump & dump detection, market sentiment analysis, and comprehensive portfolio tracking. 
                Make informed decisions with professional-grade analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="glass rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="text-green-400" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Bitcoin</div>
                        <div className="text-sm text-gray-400">+5.2% (24h)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">$43,250</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <AlertTriangle className="text-orange-400" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Alert Detected</div>
                        <div className="text-sm text-gray-400">High risk coin</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-400">Risk: 78%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Brain className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Market Sentiment</div>
                        <div className="text-sm text-gray-400">Fear & Greed Index</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">65 - Greed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/5 border-y border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="text-green-400" size={28} />
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-1">$6,000+</div>
                <div className="text-lg font-semibold text-white mb-1">Losses Prevented</div>
                <div className="text-sm text-gray-400">Protected our users from risky trades and manipulation schemes</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="text-blue-400" size={28} />
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-1">70,000+</div>
                <div className="text-lg font-semibold text-white mb-1">Trades Analyzed</div>
                <div className="text-sm text-gray-400">Real-time analysis of market movements and patterns</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="text-purple-400" size={28} />
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-1">10,000+</div>
                <div className="text-lg font-semibold text-white mb-1">People Reached</div>
                <div className="text-sm text-gray-400">Trusted by traders and investors worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Everything you need to make informed cryptocurrency investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pump & Dump Detection</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced algorithms identify suspicious market activity and potential manipulation patterns in real-time. 
                Get alerts before you lose money.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Market Data</h3>
              <p className="text-gray-300 leading-relaxed">
                Live prices, volumes, and market caps for top cryptocurrencies updated every minute. 
                Stay ahead with instant data.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Charts</h3>
              <p className="text-gray-300 leading-relaxed">
                Comprehensive price history with multiple timeframes and technical indicators. 
                Visualize trends and patterns.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sentiment Analysis</h3>
              <p className="text-gray-300 leading-relaxed">
                Fear & Greed Index integration provides market sentiment indicators. 
                Understand market psychology.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <GitCompare className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Coin Comparison</h3>
              <p className="text-gray-300 leading-relaxed">
                Compare up to 4 coins side-by-side with detailed metrics. 
                Make better investment choices.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Bell className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Price Alerts</h3>
              <p className="text-gray-300 leading-relaxed">
                Set custom price alerts for your favorite coins. 
                Never miss an opportunity or exit point.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Grid className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Market Heatmap</h3>
              <p className="text-gray-300 leading-relaxed">
                Visual representation of market performance across all major cryptocurrencies. 
                Spot trends at a glance.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Risk Scoring</h3>
              <p className="text-gray-300 leading-relaxed">
                Intelligent risk analysis based on volume spikes, price surges, and market cap changes. 
                Protect your portfolio.
              </p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Portfolio Tracker</h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor your cryptocurrency holdings with profit/loss tracking and performance analytics. 
                Stay on top of your investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Three simple steps to protect and grow your crypto portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="text-2xl font-bold text-blue-400">1</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sign Up</h3>
              <p className="text-gray-300 leading-relaxed">
                Create your free account in seconds. No credit card required. 
                Get instant access to all features.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="text-2xl font-bold text-purple-400">2</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Connect Your Portfolio</h3>
              <p className="text-gray-300 leading-relaxed">
                Add your holdings or sync with your exchange. 
                Start tracking your investments immediately.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="text-2xl font-bold text-green-400">3</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get Protected</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive real-time alerts and insights. 
                Make informed decisions with professional analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Join thousands of satisfied traders using Quantro
            </p>
          </div>

          {/* Carousel */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="min-w-full px-4">
                    <div className="card">
                      <Quote className="text-blue-400 mb-4" size={32} />
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold`}>
                          {testimonial.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-400">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTestimonial === index
                      ? 'bg-blue-400 w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-white/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Protect Your Portfolio?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join over 10,000 traders using Quantro to make smarter crypto investment decisions. 
              Start your free trial today - no credit card required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Free Account
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Quantro
              </div>
              <p className="text-gray-400 text-sm">
                Advanced cryptocurrency analytics and pump & dump detection platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            <p>&copy; 2024 Quantro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
