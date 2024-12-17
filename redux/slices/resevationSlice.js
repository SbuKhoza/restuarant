import { createSlice } from '@reduxjs/toolkit';

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
    submitReservationStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
      state.reservationSuccess = false;
    },
    submitReservationSuccess: (state) => {
      state.isSubmitting = false;
      state.reservationSuccess = true;
      // Reset form after successful submission
      state.name = '';
      state.email = '';
      state.phoneNumber = '';
      state.guests = '';
      state.date = new Date().toDateString();
      state.time = new Date().toLocaleTimeString();
    },
    submitReservationFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
      state.reservationSuccess = false;
    },
    resetReservation: () => initialState
  }
});

// Async thunk for submission (you'll need to implement the actual API call)
export const submitReservation = (reservationData) => async (dispatch) => {
  dispatch(reservationSlice.actions.submitReservationStart());
  
  try {
    // Replace with actual API call
    // const response = await api.createReservation(reservationData);
    
    // Simulated successful submission
    dispatch(reservationSlice.actions.submitReservationSuccess());
  } catch (error) {
    dispatch(reservationSlice.actions.submitReservationFailure(error.message));
  }
};

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