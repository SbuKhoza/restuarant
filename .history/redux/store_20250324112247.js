import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import restaurantReducer from './slices/restuarantSlice';
import reservationReducer from './slices/reservationSlice';
import userReducer  from './slices/userSlice';
import paymentReducer from './slices/paymentSlice';
import feedbackReducer from './slices/feedbackSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    reservation: reservationReducer,
    user: userReducer,
    payment: paymentReducer,
    feedback: feedbackReducer,

  },
});

export default store;