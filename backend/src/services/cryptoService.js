const axios = require('axios');
require('dotenv').config();

const COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

class CryptoService {
  // Get all cryptocurrencies with market data
  static async getAllCryptos(params = {}) {
    try {
      const defaultParams = {
        vs_currency: params.vs_currency || 'usd',
        order: params.order || 'market_cap_desc',
        per_page: params.per_page || 50,
        page: params.page || 1,
        sparkline: params.sparkline || false,
      };

      const response = await axios.get(`${COINGECKO_API_URL}/markets`, {
        params: defaultParams,
      });

      return this.formatCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching cryptocurrencies:', error);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  // Get cryptocurrency by ID with detailed information
  static async getCryptoById(id) {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/coins/${id.toLowerCase()}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      });

      return this.formatDetailedCryptoData(response.data);
    } catch (error) {
      console.error(`Error fetching ${id}:`, error);
      throw new Error(`Failed to fetch ${id} data`);
    }
  }

  // Search cryptocurrencies by query
  static async searchCryptos(query) {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/search`, {
        params: {
          query: query,
        },
      });

      // Return top 10 results
      return response.data.coins.slice(0, 10).map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        thumb: coin.thumb,
        market_cap_rank: coin.market_cap_rank,
      }));
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      throw new Error('Failed to search cryptocurrencies');
    }
  }

  // Get market chart data for a specific crypto
  static async getMarketChart(id, days = 7) {
    try {
      const response = await axios.get(
        `${COINGECKO_API_URL}/coins/${id.toLowerCase()}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: 'daily',
          },
        }
      );

      return {
        prices: response.data.prices,
        market_caps: response.data.market_caps,
        volumes: response.data.volumes,
      };
    } catch (error) {
      console.error(`Error fetching chart for ${id}:`, error);
      throw new Error(`Failed to fetch chart data for ${id}`);
    }
  }

  // Get trending cryptocurrencies
  static async getTrendingCryptos() {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/search/trending`);

      return response.data.coins.slice(0, 7).map((coin) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol.toUpperCase(),
        thumb: coin.item.thumb,
        market_cap_rank: coin.item.market_cap_rank,
      }));
    } catch (error) {
      console.error('Error fetching trending cryptocurrencies:', error);
      throw new Error('Failed to fetch trending cryptocurrencies');
    }
  }

  // Get market data summary
  static async getMarketData() {
    try {
      const response = await axios.get(`${COINGECKO_API_URL}/global`);

      return {
        btc_dominance: response.data.data.btc_dominance,
        eth_dominance: response.data.data.eth_dominance,
        market_cap_usd: response.data.data.total_market_cap.usd,
        market_cap_change_24h: response.data.data.market_cap_change_percentage_24h_usd,
        total_volume: response.data.data.total_volume.usd,
        btc_price: response.data.data.btc_price,
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  }

  // Format crypto data for response
  static formatCryptoData(data) {
    return data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
      price_change_percentage_30d: coin.price_change_percentage_30d_in_currency,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      atl: coin.atl,
      image: coin.image,
    }));
  }

  // Format detailed crypto data
  static formatDetailedCryptoData(data) {
    const marketData = data.market_data;
    return {
      id: data.id,
      symbol: data.symbol?.toUpperCase(),
      name: data.name,
      description: data.description?.en?.substring(0, 300) || '',
      current_price: marketData?.current_price?.usd,
      market_cap: marketData?.market_cap?.usd,
      market_cap_rank: data.market_cap_rank,
      fully_diluted_valuation: marketData?.fully_diluted_valuation?.usd,
      total_volume: marketData?.total_volume?.usd,
      high_24h: marketData?.high_24h?.usd,
      low_24h: marketData?.low_24h?.usd,
      price_change_24h: marketData?.price_change_24h,
      price_change_percentage_24h: marketData?.price_change_percentage_24h,
      price_change_percentage_7d: marketData?.price_change_percentage_7d,
      price_change_percentage_30d: marketData?.price_change_percentage_30d,
      price_change_percentage_1y: marketData?.price_change_percentage_1y,
      circulating_supply: marketData?.circulating_supply,
      total_supply: marketData?.total_supply,
      max_supply: marketData?.max_supply,
      ath: marketData?.ath?.usd,
      ath_change_percentage: marketData?.ath_change_percentage?.usd,
      atl: marketData?.atl?.usd,
      atl_change_percentage: marketData?.atl_change_percentage?.usd,
      roi: data.roi,
      image: data.image?.large,
      homepage: data.links?.homepage?.[0],
      blockchain_site: data.links?.blockchain_site?.[0],
    };
  }
}

module.exports = CryptoService;
