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
      return rejectWithValue(error.response.data.message || 'Failed to fetch restaurants');
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
        state.error = action.payload;
        state.restaurants = [];
      });
  }
});

// Export actions and reducer
export const { 
  addRestaurant, 
  removeRestaurant 
} = restaurantSlice.actions;

export default restaurantSlice.reducer;