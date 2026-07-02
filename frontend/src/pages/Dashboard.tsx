import React, { useEffect } from 'react'
import { useCrypto } from '../hooks/useCrypto'

const Dashboard = () => {
  const { marketData, trending, loading, fetchMarketData, fetchTrendingCryptos } = useCrypto()

  useEffect(() => {
    fetchMarketData()
    fetchTrendingCryptos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-cyan-400">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Crypto Dashboard</h1>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">Total Market Cap</h2>
          <p className="text-3xl font-bold text-cyan-400">
            ${(marketData?.market_cap_usd / 1e12)?.toFixed(2)}T
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">24h Change</h2>
          <p className={`text-3xl font-bold ${
            marketData?.market_cap_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {marketData?.market_cap_change_24h?.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">BTC Dominance</h2>
          <p className="text-3xl font-bold text-cyan-400">{marketData?.btc_dominance?.toFixed(2)}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">ETH Dominance</h2>
          <p className="text-3xl font-bold text-cyan-400">{marketData?.eth_dominance?.toFixed(2)}%</p>
        </div>
      </div>

      {/* Trending Cryptocurrencies */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">🔥 Trending Cryptocurrencies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.map((crypto) => (
            <div key={crypto.id} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition cursor-pointer">
              <div className="flex items-center space-x-2 mb-3">
                <img src={crypto.thumb} alt={crypto.name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-bold text-sm">{crypto.name}</p>
                  <p className="text-gray-400 text-xs">{crypto.symbol}</p>
                </div>
              </div>
              <p className="text-cyan-400 font-bold">#{crypto.market_cap_rank}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
