import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationApi } from '../../api/Api'; 

// Async thunk for reservation submission
export const submitReservation = createAsyncThunk(
  'reservation/submitReservation',
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await reservationApi.createReservation(reservationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Reservation failed');
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
  reservationSuccess: false
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
      .addCase(submitReservation.fulfilled, (state) => {
        state.isSubmitting = false;
        state.reservationSuccess = true;
        // Reset form after successful submission
        state.name = '';
        state.email = '';
        state.phoneNumber = '';
        state.guests = '';
        state.date = new Date().toDateString();
        state.time = new Date().toLocaleTimeString();
      })
      .addCase(submitReservation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        state.reservationSuccess = false;
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