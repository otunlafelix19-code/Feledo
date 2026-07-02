const CryptoService = require('../services/cryptoService');

// Get all cryptocurrencies
const getAllCryptos = async (req, res) => {
  try {
    const { vs_currency = 'usd', order = 'market_cap_desc', per_page = 50, page = 1 } = req.query;

    const cryptos = await CryptoService.getAllCryptos({
      vs_currency,
      order,
      per_page: Math.min(parseInt(per_page), 250), // Cap at 250
      page: parseInt(page),
    });

    return res.status(200).json({
      status: 200,
      message: 'Cryptocurrencies fetched successfully',
      data: cryptos,
    });
  } catch (error) {
    console.error('Error in getAllCryptos:', error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      error: 'CRYPTO_FETCH_ERROR',
    });
  }
};

// Get cryptocurrency by ID
const getCryptoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: 'Cryptocurrency ID is required',
        error: 'MISSING_PARAM',
      });
    }

    const crypto = await CryptoService.getCryptoById(id);

    return res.status(200).json({
      status: 200,
      message: `${id} details fetched successfully`,
      data: crypto,
    });
  } catch (error) {
    console.error('Error in getCryptoById:', error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      error: 'CRYPTO_FETCH_ERROR',
    });
  }
};

// Search cryptocurrencies
const searchCryptos = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Search query is required',
        error: 'MISSING_PARAM',
      });
    }

    const results = await CryptoService.searchCryptos(query);

    return res.status(200).json({
      status: 200,
      message: `Search results for "${query}"`,
      data: results,
    });
  } catch (error) {
    console.error('Error in searchCryptos:', error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      error: 'SEARCH_ERROR',
    });
  }
};

// Get market chart data
const getMarketChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.query;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: 'Cryptocurrency ID is required',
        error: 'MISSING_PARAM',
      });
    }

    const chartData = await CryptoService.getMarketChart(id, parseInt(days));

    return res.status(200).json({
      status: 200,
      message: `Chart data for ${id}`,
      data: chartData,
    });
  } catch (error) {
    console.error('Error in getMarketChart:', error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      error: 'CHART_ERROR',
    });
  }
};

// Get trending cryptocurrencies
const getTrendingCryptos = async (req, res) => {
  try {
    const trending = await CryptoService.getTrendingCryptos();

    return res.status(200).json({
      status: 200,
      message: 'Trending cryptocurrencies fetched',
      data: trending,
    });
  } catch (error) {
    console.error('Error in getTrendingCryptos:', error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      error: 'TRENDING_ERROR',
    });
  }
};

// Get market overview data
const getMarketData = async (req, res) => {
  try {
    const marketData = await CryptoService.getMarketData();

    return res.status(200).json({
      status: 200,
      message: 'Market data fetched successfully',
      data: marketData,
    });
  } catch (error) {
    console.error('Error in getMarketData:', error);
    return res.status(500).json({
      status: 500,
      message: error.message,
      error: 'MARKET_DATA_ERROR',
    });
  }
};

module.exports = {
  getAllCryptos,
  getCryptoById,
  searchCryptos,
  getMarketChart,
  getTrendingCryptos,
  getMarketData,
};
