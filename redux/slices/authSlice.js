import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/Api'; 

// Helper function to validate token
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic token format validation
    const parts = token.split('.');
    return parts.length === 3;
  } catch (error) {
    return false;
  }
};

// Async thunks for login and signup
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      
      // Validate token before storing
      if (!data.token || !isTokenValid(data.token)) {
        return rejectWithValue('Invalid authentication token');
      }
      
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login failed';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.signup(userData);
      
      // Validate token before storing
      if (!data.token || !isTokenValid(data.token)) {
        return rejectWithValue('Invalid authentication token');
      }
      
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Signup Error:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Signup failed';
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for user profile fetch
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userProfile = await authApi.getUserProfile();
      return userProfile;
    } catch (error) {
      console.error('Fetch Profile Error:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch user profile';
      
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Clear invalid user data
      return null;
    }
  })(),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: isTokenValid(localStorage.getItem('token'))
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login reducers
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Signup reducers
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // User Profile reducers
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  logout, 
  clearError 
} = authSlice.actions;
export default authSlice.reducer;