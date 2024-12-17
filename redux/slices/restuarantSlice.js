import { createSlice } from '@reduxjs/toolkit';

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
    // Reducer to set restaurants from CMS
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Reducer to add a new restaurant
    addRestaurant: (state, action) => {
      state.restaurants.push(action.payload);
    },
    
    // Reducer to remove a restaurant
    removeRestaurant: (state, action) => {
      state.restaurants = state.restaurants.filter(
        restaurant => restaurant.id !== action.payload
      );
    },
    
    // Reducer to handle loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Reducer to handle errors
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

// Export actions and reducer
export const { 
  setRestaurants, 
  addRestaurant, 
  removeRestaurant,
  setLoading,
  setError
} = restaurantSlice.actions;

export default restaurantSlice.reducer;