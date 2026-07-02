const express = require('express');
const router = express.Router();
const {
  getAllCryptos,
  getCryptoById,
  searchCryptos,
  getMarketChart,
  getTrendingCryptos,
  getMarketData,
} = require('../controllers/cryptoController');

// Public routes
router.get('/list', getAllCryptos);
router.get('/details/:id', getCryptoById);
router.get('/search/:query', searchCryptos);
router.get('/chart/:id', getMarketChart);
router.get('/trending', getTrendingCryptos);
router.get('/market/overview', getMarketData);

module.exports = router;
