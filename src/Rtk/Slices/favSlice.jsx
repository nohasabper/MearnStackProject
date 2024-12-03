import { createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Load favorite items from local storage
const loadFavoritesFromLocalStorage = () => {
  try {
    const serializedFavorites = localStorage.getItem('favoriteItems');
    return serializedFavorites ? JSON.parse(serializedFavorites) : [];
  } catch (e) {
    console.warn("Could not load favorites from localStorage", e);
    return [];
  }
};

// Save favorite items to local storage
const saveFavoritesToLocalStorage = (favoriteItems) => {
  try {
    const serializedFavorites = JSON.stringify(favoriteItems);
    localStorage.setItem('favoriteItems', serializedFavorites);
  } catch (e) {
    console.warn("Could not save favorites to localStorage", e);
  }
};

// Initial favorites state
const initialState = {
  favoriteItems: loadFavoritesFromLocalStorage(), // Load from local storage
};

// Slice to manage favorites
const favSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const product = action.payload;
      const existingProduct = state.favoriteItems.find((item) => item.id === product.id);

      if (!existingProduct) {
        state.favoriteItems.push(product);
        saveFavoritesToLocalStorage(state.favoriteItems); // Save to local storage whenever favorites change
        
        // Show SweetAlert2 notification for adding to favorites
        Swal.fire({
          icon: 'success',
          title: 'تمت الإضافة إلى المفضلة!',
          text: 'تمت إضافة المنتج إلى المفضلة بنجاح.',
          confirmButtonText: 'موافق'
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'المنتج موجود بالفعل!',
          text: 'هذا المنتج موجود بالفعل في المفضلة.',
          confirmButtonText: 'موافق'
        });
      }
    },
    removeFavorite: (state, action) => {
      const productId = action.payload;
      state.favoriteItems = state.favoriteItems.filter((item) => item.id !== productId);
      saveFavoritesToLocalStorage(state.favoriteItems); // Save to local storage whenever favorites change

      // Show SweetAlert2 notification for removing from favorites
      Swal.fire({
        icon: 'info',
        title: 'تمت إزالته من المفضلة!',
        text: 'تمت إزالة المنتج من المفضلة بنجاح.',
        confirmButtonText: 'موافق'
      });
    },
    clearFavorites: (state) => {
      state.favoriteItems = [];
      saveFavoritesToLocalStorage([]); // Save empty favorites to local storage
      
      // Show SweetAlert2 notification for clearing favorites
      Swal.fire({
        icon: 'warning',
        title: 'تمت إزالة المفضلة!',
        text: 'تمت إزالة جميع المنتجات من المفضلة.',
        confirmButtonText: 'موافق'
      });
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favSlice.actions;

export default favSlice.reducer;
