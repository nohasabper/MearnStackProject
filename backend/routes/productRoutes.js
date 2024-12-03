const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware'); 
const authorizeRoles = require('../middlewares/authorizeRoles');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// Public route - no token required


// Protected routes - token required
router.post('/products', authenticateToken, authorizeRoles('admin'), upload.single('image'), productController.createProduct); 
router.get('/products/category/:categoryNumber', productController.getProductsByCategory);
router.get('/products/:id', productController.getProduct);
router.get('/products', productController.getAllProducts);
router.put('/products/:id', authenticateToken, authorizeRoles('admin'), upload.single('image'), productController.updateProduct);
router.delete('/products/:id', authenticateToken, authorizeRoles('admin'), productController.deleteProduct);

module.exports = router;
