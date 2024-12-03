const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
// Create Order
router.post('/orders', orderController.createOrder);

// Get Order by ID
router.get('/orders', authMiddleware, orderController.getUserOrders); // Updated route

// Update Order
router.put('/orders/:id', authMiddleware, authorizeRoles('admin'), orderController.updateOrder);

// Delete Order
router.delete('/orders/:id', authMiddleware, orderController.deleteOrder);

// Get All Orders
router.get('/ordersall', authMiddleware, authorizeRoles('admin'), orderController.getAllOrders);


router.get('/orderSubmited', authMiddleware, authorizeRoles('admin'), orderController.getSubmittedOrders);

module.exports = router;
