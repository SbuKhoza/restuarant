import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating payment intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/reservations/create-payment', {
        restaurantId: reservationData.restaurantId,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        specialRequests: reservationData.specialRequests,
        customerName: reservationData.name,
        customerEmail: reservationData.email,
        customerPhoneNumber: reservationData.phone
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
    }
  }
);

// Async thunk for confirming payment
export const confirmPaymentIntent = createAsyncThunk(
  'payment/confirmPaymentIntent',
  async ({ reservationId, paymentIntentId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/reservations/confirm-payment', {
        reservationId,
        paymentIntentId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm payment');
    }
  }
);

const initialState = {
  isProcessing: false,
  isSuccess: false,
  error: null,
  clientSecret: null,
  reservationId: null,
  paymentIntentId: null,
  paymentStatus: 'idle', // 'idle' | 'processing' | 'succeeded' | 'failed'
  lastPaymentError: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      return initialState;
    },
    setPaymentError: (state, action) => {
      state.error = action.payload;
      state.isProcessing = false;
      state.paymentStatus = 'failed';
    },
    clearPaymentError: (state) => {
      state.error = null;
      state.lastPaymentError = null;
    }
  },
  extraReducers: (builder) => {
    // Create Payment Intent
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
        state.paymentStatus = 'processing';
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.clientSecret = action.payload.clientSecret;
        state.reservationId = action.payload.reservationId;
        state.paymentStatus = 'processing';
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
        state.lastPaymentError = action.payload;
      })

    // Confirm Payment Intent
      .addCase(confirmPaymentIntent.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(confirmPaymentIntent.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.isSuccess = true;
        state.paymentIntentId = action.payload.paymentIntentId;
        state.paymentStatus = 'succeeded';
      })
      .addCase(confirmPaymentIntent.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
        state.lastPaymentError = action.payload;
      });
  }
});

export const { resetPaymentState, setPaymentError, clearPaymentError } = paymentSlice.actions;

// Selectors
export const selectPaymentState = (state) => ({
  isProcessing: state.payment.isProcessing,
  isSuccess: state.payment.isSuccess,
  error: state.payment.error,
  paymentStatus: state.payment.paymentStatus,
  lastPaymentError: state.payment.lastPaymentError
});

export default paymentSlice.reducer;