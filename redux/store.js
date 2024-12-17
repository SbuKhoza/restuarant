import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import restaurantReducer from './slices/restuarantSlice';
import reservationReducer from './slices/resevationSlice';
import userReducer  from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    reservation: reservationReducer,
    user: userReducer,
  },
});

export default store;