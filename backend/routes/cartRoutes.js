const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Create or Update Cart
router.post('/cart', cartController.createOrUpdateCart);

// Get Cart by User ID
router.get('/cart/:userId', cartController.getCart);

// Delete Cart
router.delete('/cart/:userId', cartController.deleteCart);

// Add Product to Cart
router.post('/cart/add-product', cartController.addProductToCart);

// Remove Product from Cart
router.post('/cart/remove-product', cartController.removeProductFromCart);

module.exports = router;
