import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/Auth';
import cartReducer from './Slices/CartSlice';
import favReducer from './Slices/favSlice'; 
import './axiosSetup'; 

const Store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        favorites: favReducer,
        // Add other reducers here if needed
    },
});

export default Store;
