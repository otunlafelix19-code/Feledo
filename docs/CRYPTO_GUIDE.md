# Crypto Data Integration Guide

## Overview

Feledo integrates with CoinGecko's free API to provide real-time cryptocurrency market data, prices, charts, and trending information.

## CoinGecko API Integration

### Features Implemented

1. **Get All Cryptocurrencies** - Fetch top cryptocurrencies with market data
2. **Get Crypto Details** - Detailed information about a specific cryptocurrency
3. **Search Cryptocurrencies** - Search for cryptos by name or symbol
4. **Market Charts** - Historical price data for charting
5. **Trending Cryptocurrencies** - Get trending cryptos
6. **Market Overview** - Global market data

## Backend Endpoints

### 1. Get All Cryptocurrencies
**GET** `/api/crypto/list`

**Query Parameters:**
```
GET /api/crypto/list?vs_currency=usd&order=market_cap_desc&per_page=50&page=1
```

**Response:**
```json
{
  "status": 200,
  "message": "Cryptocurrencies fetched successfully",
  "data": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "current_price": 45000,
      "market_cap": 900000000000,
      "market_cap_rank": 1,
      "price_change_percentage_24h": 2.5,
      "price_change_percentage_7d": 5.2,
      "image": "https://assets.coingecko.com/..."
    }
  ]
}
```

### 2. Get Cryptocurrency Details
**GET** `/api/crypto/details/:id`

**Example:**
```
GET /api/crypto/details/bitcoin
```

**Response:**
```json
{
  "status": 200,
  "message": "bitcoin details fetched successfully",
  "data": {
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "description": "Bitcoin is the first successful internet money...",
    "current_price": 45000,
    "market_cap": 900000000000,
    "ath": 69000,
    "atl": 100,
    "circulating_supply": 21000000,
    "homepage": "https://bitcoin.org/"
  }
}
```

### 3. Search Cryptocurrencies
**GET** `/api/crypto/search/:query`

**Example:**
```
GET /api/crypto/search/bitcoin
```

**Response:**
```json
{
  "status": 200,
  "message": "Search results for \"bitcoin\"",
  "data": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "thumb": "https://assets.coingecko.com/...",
      "market_cap_rank": 1
    }
  ]
}
```

### 4. Get Market Chart Data
**GET** `/api/crypto/chart/:id`

**Query Parameters:**
```
GET /api/crypto/chart/bitcoin?days=7
```

**Response:**
```json
{
  "status": 200,
  "message": "Chart data for bitcoin",
  "data": {
    "prices": [[1704067200000, 45000], [1704153600000, 46000]],
    "market_caps": [[1704067200000, 900000000000]],
    "volumes": [[1704067200000, 30000000000]]
  }
}
```

### 5. Get Trending Cryptocurrencies
**GET** `/api/crypto/trending`

**Response:**
```json
{
  "status": 200,
  "message": "Trending cryptocurrencies fetched",
  "data": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "thumb": "https://assets.coingecko.com/...",
      "market_cap_rank": 1
    }
  ]
}
```

### 6. Get Market Overview
**GET** `/api/crypto/market/overview`

**Response:**
```json
{
  "status": 200,
  "message": "Market data fetched successfully",
  "data": {
    "btc_dominance": 48.5,
    "eth_dominance": 18.2,
    "market_cap_usd": 1850000000000,
    "market_cap_change_24h": 2.5,
    "total_volume": 75000000000,
    "btc_price": 45000
  }
}
```

## Frontend Usage

### Using the useCrypto Hook

```typescript
import { useCrypto } from '../hooks/useCrypto';

function MyComponent() {
  const {
    cryptos,
    trending,
    marketData,
    loading,
    error,
    fetchCryptos,
    fetchTrendingCryptos,
    fetchMarketData,
  } = useCrypto();

  useEffect(() => {
    fetchCryptos({ page: 1, per_page: 50 });
    fetchTrendingCryptos();
    fetchMarketData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Market Cap: ${marketData?.market_cap_usd}</h2>
      <div>
        {cryptos.map((crypto) => (
          <div key={crypto.id}>
            <h3>{crypto.name} ({crypto.symbol})</h3>
            <p>Price: ${crypto.current_price}</p>
            <p>24h Change: {crypto.price_change_percentage_24h}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Pages Implemented

### 1. Dashboard (`/`)
- Market overview with total market cap
- 24h market change
- BTC and ETH dominance
- Trending cryptocurrencies

### 2. Crypto List (`/crypto`)
- Paginated list of all cryptocurrencies
- Sort by market cap, volume, etc.
- Click to view details

### 3. Crypto Details (`/crypto/:id`)
- Detailed information about a cryptocurrency
- Price, market cap, supply info
- 24h high/low, ATH/ATL
- External links

## CoinGecko API Limits

- **Free Tier**: 10-50 calls/minute
- **No API Key Required**: Free data access
- **Rate Limiting**: Implemented on backend

## Performance Considerations

1. **Caching**: Consider implementing Redis caching for frequently accessed data
2. **Rate Limiting**: Backend implements request throttling
3. **Frontend Caching**: Redux stores state to reduce redundant API calls
4. **Pagination**: Large datasets are paginated

## Error Handling

Common errors:

```json
{
  "status": 500,
  "message": "Failed to fetch cryptocurrency data",
  "error": "CRYPTO_FETCH_ERROR"
}
```

## Next Steps

1. Add price charts with Chart.js
2. Implement search functionality
3. Add favorites/watchlist
4. Create portfolio tracking
5. Set up price alerts

## Security Notes

- CoinGecko API data is public (no API key needed for free tier)
- Consider implementing rate limiting for production
- Cache responses to reduce API calls
- Validate all user inputs
