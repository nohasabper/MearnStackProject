const Review = require('../models/review');
const Product = require('../models/product'); 

exports.createReview = async (req, res) => {
    try {
        // Create a new review
        const { product, rating } = req.body;
        const newReview = await Review.create({ product, rating });

        // Fetch all reviews for this product
        const reviews = await Review.find({ product });

        // Calculate the new average rating
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        // Update the product with the new average rating
        await Product.findByIdAndUpdate(product, { rating: averageRating });

        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit review' });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user').populate('product');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single review
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('user').populate('product');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { rating } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (rating !== undefined) { // Check if rating is provided
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            review.rating = rating; // Update the rating if valid
        }
        
        await review.save();
        await updateProductRating(review.product); // Update product rating after review update
        res.status(200).json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        await updateProductRating(review.product); // Update product rating after deletion
        res.status(204).json({ message: 'Review deleted successfully' }); // Provide a confirmation message
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Helper function to update product rating
async function updateProductRating(productId) {
    const reviews = await Review.find({ product: productId });
    const averageRating = reviews.length > 0 
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
        : 0; // or null

    await Product.findByIdAndUpdate(productId, { averageRating: averageRating });
}
