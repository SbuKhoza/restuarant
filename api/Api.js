import axios from 'axios';

const BASE_URL = 'https://restaurent-cms.onrender.com/api';

// Create an axios instance with base configuration
const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Added timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include token and log requests
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request details for debugging
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  return config;
}, (error) => {
  console.error('Request Interceptor Error:', error);
  return Promise.reject(error);
});

// Add a response interceptor for error handling and logging
Api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Detailed error logging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Throw a more informative error
    if (error.response) {
      // The request was made and the server responded with a status code
      const errorMessage = error.response.data.message 
        || error.response.data.error 
        || 'An error occurred';
      
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server. Check your network connection.');
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up the request');
    }
  }
);

// Auth API calls with enhanced error handling
export const authApi = {
  login: async (credentials) => {
    try {
      const response = await Api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API Error:', error.message);
      throw error;
    }
  },
  signup: async (userData) => {
    try {
      const response = await Api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Signup API Error:', error.message);
      throw error;
    }
  }
};

// Rest of the API methods remain the same
export const userApi = {
  getUserProfile: async () => {
    try {
      const response = await Api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Get User Profile Error:', error.message);
      throw error;
    }
  },
  updateUserProfile: async (userData) => {
    try {
      const response = await Api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Update User Profile Error:', error.message);
      throw error;
    }
  }
};

// Similar error handling added to other API methods
export const restaurantApi = {
  getAllRestaurants: async () => {
    try {
      const response = await Api.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Get Restaurants Error:', error.message);
      throw error;
    }
  },
  getRestaurantById: async (id) => {
    try {
      const response = await Api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get Restaurant by ID Error:', error.message);
      throw error;
    }
  }
};

export const reservationApi = {
  createReservation: async (reservationData) => {
    try {
      const response = await Api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error('Create Reservation Error:', error.message);
      throw error;
    }
  }
};

// Export Api as the default export
export default Api;