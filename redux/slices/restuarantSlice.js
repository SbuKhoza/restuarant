import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantApi } from '../../api/Api';

// Async thunk to fetch restaurants
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const restaurants = await restaurantApi.getAllRestaurants();
      return restaurants;
    } catch (error) {
      console.error('Fetch Restaurants Error:', error);
      
      // More comprehensive error handling
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch restaurants';
      
      // Check for specific authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state with an empty restaurants array
const initialState = {
  restaurants: [],
  isLoading: false,
  error: null
};

// Create the restaurant slice
const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    // Synchronous reducers remain the same
    addRestaurant: (state, action) => {
      state.restaurants.push(action.payload);
    },
    
    removeRestaurant: (state, action) => {
      state.restaurants = state.restaurants.filter(
        restaurant => restaurant.id !== action.payload
      );
    },

    // Clear error state
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.restaurants = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch restaurants';
        state.restaurants = [];
      });
  }
});

// Export actions and reducer
export const { 
  addRestaurant, 
  removeRestaurant,
  clearError
} = restaurantSlice.actions;

export default restaurantSlice.reducer;