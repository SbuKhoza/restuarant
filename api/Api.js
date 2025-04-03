import axios from 'axios';

const BASE_URL = 'https://restaurent-cms.onrender.com/api';

// Create an axios instance with base configuration
const Api = axios.create({
  baseURL: BASE_URL,
  timeout: 40000, // Added timeout to prevent hanging requests
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

// User API methods
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
      console.log('API createReservation called with:', reservationData);
      
      // Check for required fields
      if (!reservationData.restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      
      // Format the data according to what the backend expects
      const formattedData = {
        restaurantId: reservationData.restaurantId,
        date: reservationData.date,
        time: reservationData.time,
        guests: parseInt(reservationData.guests),
        customerName: reservationData.name,
        customerEmail: reservationData.email,
        customerPhoneNumber: reservationData.phoneNumber,
        specialRequests: reservationData.specialRequests || ''
      };
      
      console.log('Sending formatted data to API:', formattedData);
      
      const response = await Api.post('/reservations', formattedData);
      console.log('Reservation API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create Reservation API Error:', error);
      // Enhanced error handling
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create reservation');
      }
    }
  },
  
  createReservationPayment: async (reservationData) => {
    try {
      console.log('API createReservationPayment called with:', reservationData);
      
      // Format the data for payment initialization
      const formattedData = {
        restaurantId: reservationData.restaurantId,
        date: reservationData.date,
        time: reservationData.time,
        guests: parseInt(reservationData.guests),
        customerName: reservationData.name || reservationData.customerName,
        customerEmail: reservationData.email || reservationData.customerEmail,
        customerPhoneNumber: reservationData.phoneNumber || reservationData.customerPhoneNumber,
        specialRequests: reservationData.specialRequests || ''
      };
      
      console.log('Sending payment request with data:', formattedData);
      
      const response = await Api.post('/reservations/payment', formattedData);
      console.log('Payment API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create Reservation Payment Error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Payment initialization failed');
    }
  },
  
  getAvailability: async (restaurantId, date) => {
    try {
      const response = await Api.get(`/reservations/availability/${restaurantId}/${date}`);
      return response.data;
    } catch (error) {
      console.error('Get Availability Error:', error.message);
      throw error;
    }
  },
  
  getUserReservations: async () => {
    try {
      const response = await Api.get('/reservations/user');
      return response.data;
    } catch (error) {
      console.error('Get User Reservations Error:', error.message);
      throw error;
    }
  },
  
  cancelReservation: async (reservationId) => {
    try {
      const response = await Api.put(`/reservations/${reservationId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel Reservation Error:', error.message);
      throw error;
    }
  },
  
  confirmPayment: async (reservationId, paymentReference) => {
    try {
      const response = await Api.post('/reservations/confirm-payment', {
        reservationId,
        paymentReference
      });
      return response.data;
    } catch (error) {
      console.error('Confirm Payment Error:', error.message);
      throw error;
    }
  }
};

// Export Api as the default export
export default Api;