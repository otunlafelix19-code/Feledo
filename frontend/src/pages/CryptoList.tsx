import React, { useEffect, useState } from 'react'
import { useCrypto } from '../hooks/useCrypto'
import { useNavigate } from 'react-router-dom'

const CryptoList = () => {
  const { cryptos, loading, error, fetchCryptos } = useCrypto()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCryptos({ page, per_page: 50 })
  }, [page])

  const handleCryptoClick = (cryptoId: string) => {
    navigate(`/crypto/${cryptoId}`)
  }

  if (loading && cryptos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-cyan-400">Loading cryptocurrencies...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Cryptocurrencies</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-500 text-white rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-right">24h Change</th>
              <th className="px-6 py-4 text-right">7d Change</th>
              <th className="px-6 py-4 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => (
              <tr
                key={crypto.id}
                onClick={() => handleCryptoClick(crypto.id)}
                className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition"
              >
                <td className="px-6 py-4 font-bold">{crypto.market_cap_rank}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-bold">{crypto.name}</p>
                      <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold">${crypto.current_price?.toLocaleString()}</td>
                <td
                  className={`px-6 py-4 text-right font-bold ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {crypto.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold ${
                    crypto.price_change_percentage_7d >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {crypto.price_change_percentage_7d?.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right">${(crypto.market_cap / 1e9)?.toFixed(2)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 px-4 py-2 rounded transition"
        >
          Previous
        </button>
        <span className="text-gray-400">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded transition"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CryptoList
