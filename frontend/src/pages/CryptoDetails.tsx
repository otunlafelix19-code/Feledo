import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCrypto } from '../hooks/useCrypto'

const CryptoDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { selectedCrypto, loading, error, fetchCryptoDetails } = useCrypto()

  useEffect(() => {
    if (id) {
      fetchCryptoDetails(id)
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-cyan-400">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="p-4 bg-red-500 text-white rounded">{error}</div>
      </div>
    )
  }

  if (!selectedCrypto) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="p-4 bg-gray-800 rounded">Cryptocurrency not found</div>
      </div>
    )
  }

  const crypto = selectedCrypto

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <img src={crypto.image} alt={crypto.name} className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold">{crypto.name}</h1>
            <p className="text-gray-400">{crypto.symbol}</p>
          </div>
        </div>

        {crypto.description && (
          <p className="text-gray-300 mb-6 line-clamp-3">{crypto.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">Current Price</p>
            <p className="text-2xl font-bold text-cyan-400">${crypto.current_price?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">24h Change</p>
            <p className={`text-2xl font-bold ${
              crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {crypto.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">Market Cap Rank</p>
            <p className="text-2xl font-bold">#{crypto.market_cap_rank}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">Market Cap</p>
            <p className="text-2xl font-bold">${(crypto.market_cap / 1e9)?.toFixed(2)}B</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Market Data</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">24h High:</span>
              <span className="font-bold">${crypto.high_24h?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">24h Low:</span>
              <span className="font-bold">${crypto.low_24h?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">All Time High:</span>
              <span className="font-bold">${crypto.ath?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">All Time Low:</span>
              <span className="font-bold">${crypto.atl?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Supply Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Circulating Supply:</span>
              <span className="font-bold">{crypto.circulating_supply?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Supply:</span>
              <span className="font-bold">{crypto.total_supply?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Supply:</span>
              <span className="font-bold">{crypto.max_supply?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoDetails
