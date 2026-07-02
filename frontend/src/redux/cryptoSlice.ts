import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoApi } from '../services/api';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  image: string;
}

export interface CryptoState {
  cryptos: CryptoData[];
  selectedCrypto: CryptoData | null;
  trending: CryptoData[];
  marketData: any;
  chartData: any;
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  cryptos: [],
  selectedCrypto: null,
  trending: [],
  marketData: null,
  chartData: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptos',
  async (params?: { page?: number; per_page?: number }, { rejectWithValue }) => {
    try {
      const response = await cryptoApi.getAllCryptos({
        per_page: params?.per_page || 50,
        page: params?.page || 1,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cryptos');
    }
  }
);

export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cryptoApi.getCryptoDetails(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch crypto details');
    }
  }
);

export const fetchTrendingCryptos = createAsyncThunk(
  'crypto/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cryptoApi.getTrendingCryptos();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trending');
    }
  }
);

export const fetchMarketData = createAsyncThunk(
  'crypto/fetchMarketData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cryptoApi.getMarketData();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch market data');
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'crypto/fetchChartData',
  async ({ id, days }: { id: string; days?: number }, { rejectWithValue }) => {
    try {
      const response = await cryptoApi.getMarketChart(id, days || 7);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chart data');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelected: (state) => {
      state.selectedCrypto = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cryptos
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptos = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Crypto Details
    builder
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCrypto = action.payload;
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Trending
    builder
      .addCase(fetchTrendingCryptos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingCryptos.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrendingCryptos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Market Data
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.marketData = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Chart Data
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelected } = cryptoSlice.actions;
export default cryptoSlice.reducer;
