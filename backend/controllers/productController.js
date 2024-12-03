const Product = require('../models/product');
const Review = require('../models/review');
const mongoose = require('mongoose');

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Update product rating based on reviews
const updateProductRating = async (productId) => {
    try {
        if (!isValidObjectId(productId)) {
            throw new Error('Invalid Product ID');
        }

        const result = await Review.aggregate([
            { $match: { product: mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$product',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);
        
        if (result.length > 0) {
            const averageRating = result[0].averageRating;
            await Product.findByIdAndUpdate(productId, { rating: averageRating });
        } else {
            await Product.findByIdAndUpdate(productId, { rating: 0 });
        }
    } catch (err) {
        console.error('Error updating product rating:', err);
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, newPrice, deletedPrice, category, stock, description, offer, rate } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newProduct = await Product.create({
            name,
            newPrice, // Updated field
            deletedPrice,
            category,
            stock,
            description,
            offer,
            rate,
            image: imagePath,
        });
        
        await updateProductRating(newProduct._id);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryNumber = parseInt(req.params.categoryNumber, 10);
        if (isNaN(categoryNumber)) {
            return res.status(400).json({ error: 'Invalid category number provided.' });
        }
        const products = await Product.find({ category: categoryNumber });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Server error while fetching products.' });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a product by ID
exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(productId); 

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }

        // Log request data
        console.log('Received update request:', req.body);
        console.log('File uploaded:', req.file);

        const { name, newPrice, deletedPrice, category, stock, description, offer, rate } = req.body;
        let updateData = { name, newPrice, deletedPrice, category, stock, description, offer, rate };

        if (req.file) {
            updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Perform update
        const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Log the updated product
        console.log('Updated product:', product);

        await updateProductRating(product._id);
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(400).json({ error: error.message });
    }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ error: 'Invalid product ID format' });
        }

        const product = await Product.findByIdAndDelete(productId);
        if (!product) return res.status(404).send({ error: 'Product not found' });
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

