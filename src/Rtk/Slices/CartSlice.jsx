import { createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

// Initial cart state
const initialState = {
  cartItems: [], // Start with an empty cart
  total: 0,
};

// Utility function to calculate total price
const calculateTotal = (cartItems = []) => { // Set default to empty array
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart: (state, action) => {
      state.cartItems = action.payload || []; // Load cart items for the user or default to an empty array
      state.total = calculateTotal(state.cartItems); // Update total
    },
    addProduct: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cartItems.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if product exists
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Product added!',
          text: `${product.name} has been added to your cart.`,
          timer: 1500,
          showConfirmButton: false,
        });
        state.cartItems.push({ ...product, quantity: 1 }); // Add new product with quantity of 1
      }

      // Update total
      state.total = calculateTotal(state.cartItems);
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== productId); // Filter out removed product
      state.total = calculateTotal(state.cartItems); // Update total
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const product = state.cartItems.find((item) => item.id === productId);
      if (product) {
        product.quantity += 1; // Increase quantity
        state.total = calculateTotal(state.cartItems); // Update total
      }
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const product = state.cartItems.find((item) => item.id === productId);
      if (product) {
        if (product.quantity > 1) {
          product.quantity -= 1; // Decrease quantity
        } else {
          // Remove product if quantity is 1
          state.cartItems = state.cartItems.filter((item) => item.id !== productId);
        }
        state.total = calculateTotal(state.cartItems); // Update total
      }
    },
    clearCart: (state) => {
      state.cartItems = []; // Clear cart items
      state.total = 0; // Reset total
      Swal.fire({
        icon: 'info',
        title: 'Cart cleared!',
        text: 'Your shopping cart has been emptied.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
  },
});

// Export actions and reducer
export const { loadCart, addProduct, removeProduct, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
