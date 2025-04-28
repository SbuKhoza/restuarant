import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationApi } from '../../api/Api';

// Async thunk for creating a reservation
export const submitReservation = createAsyncThunk(
  'reservation/submitReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      console.log('Submitting reservation with data:', reservationData);
      
      // Check for required fields
      if (!reservationData.restaurantId) {
        throw new Error('Restaurant ID is required');
      }
      
      const response = await reservationApi.createReservation(reservationData);
      return response;
    } catch (error) {
      console.error('Error in submitReservation:', error);
      return rejectWithValue(error.message || 'Failed to create reservation');
    }
  }
);

const initialState = {
  name: '',
  email: '',
  phoneNumber: '',
  guests: '',
  date: new Date().toDateString(),
  time: new Date().toLocaleTimeString(),
  isSubmitting: false,
  error: null,
  reservationSuccess: false,
  reservationId: null
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.name = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updatePhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    updateGuests: (state, action) => {
      state.guests = action.payload;
    },
    updateDate: (state, action) => {
      state.date = action.payload;
    },
    updateTime: (state, action) => {
      state.time = action.payload;
    },
    resetReservation: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReservation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.reservationSuccess = false;
      })
      .addCase(submitReservation.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.reservationSuccess = true;
        // Extract the reservationId from the response
        state.reservationId = action.payload.reservation._id || action.payload.reservation.id;
        console.log('Reservation created with ID:', state.reservationId);
      })
      .addCase(submitReservation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'An error occurred';
        console.error('Reservation submission failed:', state.error);
      });
  }
});

export const {
  updateName,
  updateEmail,
  updatePhoneNumber,
  updateGuests,
  updateDate,
  updateTime,
  resetReservation
} = reservationSlice.actions;

export default reservationSlice.reducer;