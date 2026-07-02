import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchCryptos, fetchTrendingCryptos, fetchMarketData, fetchChartData, fetchCryptoDetails } from '../redux/cryptoSlice';

export const useCrypto = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cryptos, trending, marketData, chartData, selectedCrypto, loading, error } = useSelector(
    (state: RootState) => state.crypto
  );

  return {
    cryptos,
    trending,
    marketData,
    chartData,
    selectedCrypto,
    loading,
    error,
    fetchCryptos: (params?: { page?: number; per_page?: number }) =>
      dispatch(fetchCryptos(params)),
    fetchTrendingCryptos: () => dispatch(fetchTrendingCryptos()),
    fetchMarketData: () => dispatch(fetchMarketData()),
    fetchChartData: (id: string, days?: number) =>
      dispatch(fetchChartData({ id, days })),
    fetchCryptoDetails: (id: string) =>
      dispatch(fetchCryptoDetails(id)),
  };
};
