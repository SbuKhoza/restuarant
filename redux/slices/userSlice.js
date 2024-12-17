import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  currentUser: null,
  isLoading: false,
  error: null
};

// Create the user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user profile
    setUserProfile: (state, action) => {
      state.currentUser = action.payload;
    },
    // Action to update user profile
    updateUserProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    // Action to clear user profile
    clearUserProfile: (state) => {
      state.currentUser = null;
    },
    // Action to set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // Action to set error
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Export actions
export const { 
  setUserProfile, 
  updateUserProfile, 
  clearUserProfile, 
  setLoading, 
  setError 
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;