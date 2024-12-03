const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create Category
router.post('/categories', categoryController.createCategory);

// Get Category by ID
router.get('/categories/:id', categoryController.getCategory);

// Update Category
router.put('/categories/:id', categoryController.updateCategory);

// Delete Category
router.delete('/categories/:id', categoryController.deleteCategory);

// Get All Categories
router.get('/categories', categoryController.getAllCategories);


module.exports = router;
