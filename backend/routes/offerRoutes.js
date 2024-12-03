const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const offerController = require('../controllers/offerController');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter to Accept Only Images
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

// Initialize Multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// Routes
router.post('/offers', upload.single('image'), offerController.createOffer);
router.get('/offers', offerController.getAllOffers);
router.put('/offers/:id', upload.single('image'), offerController.updateOffer);
router.delete('/offers/:id', offerController.deleteOffer);

module.exports = router;
