import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/Api';

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userProfile = await userApi.getUserProfile();
      return userProfile;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch user profile');
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const updatedProfile = await userApi.updateUserProfile(userData);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update user profile');
    }
  }
);

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
    // Synchronous reducers remain the same
    clearUserProfile: (state) => {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentUser = null;
      })
      // Handle update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearUserProfile 
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;