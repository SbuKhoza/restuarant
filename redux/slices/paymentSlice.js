import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '../../api/Api';

// Async thunks for payment operations
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createPaymentIntent(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment initialization failed');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (reference, { rejectWithValue }) => {
    try {
      const response = await paymentApi.verifyPayment(reference);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const confirmPaymentIntent = createAsyncThunk(
  'payment/confirmPaymentIntent',
  async ({ reservationId, paymentReference }, { rejectWithValue, dispatch }) => {
    try {
      const response = await paymentApi.confirmPayment({
        reservationId,
        paymentReference
      });
      
      // Update reservations list with confirmed status
      dispatch(updateReservationStatus({
        id: reservationId,
        status: 'Confirmed',
        paymentReference
      }));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment confirmation failed');
    }
  }
);

const initialState = {
  isProcessing: false,
  paymentStatus: null, // 'pending' | 'processing' | 'succeeded' | 'failed'
  error: null,
  paymentReference: null,
  lastPaymentError: null,
  isSuccess: false
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setReference: (state, action) => {
      state.paymentReference = action.payload;
    },
    resetPayment: () => initialState,
    updateReservationStatus: (state, action) => {
      // This will be handled by the reservations reducer
      // We dispatch this action to update the reservation status after payment
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
        state.paymentStatus = 'pending';
      })
      .addCase(createPaymentIntent.fulfilled, (state) => {
        state.isProcessing = false;
        state.paymentStatus = 'processing';
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
        state.lastPaymentError = action.payload;
      })
      
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.isProcessing = false;
        state.isSuccess = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        state.lastPaymentError = action.payload;
      })
      
      // Confirm Payment
      .addCase(confirmPaymentIntent.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(confirmPaymentIntent.fulfilled, (state) => {
        state.isProcessing = false;
        state.paymentStatus = 'succeeded';
        state.isSuccess = true;
      })
      .addCase(confirmPaymentIntent.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
        state.lastPaymentError = action.payload;
      });
  }
});

export const { setReference, resetPayment, updateReservationStatus } = paymentSlice.actions;
export default paymentSlice.reducer;