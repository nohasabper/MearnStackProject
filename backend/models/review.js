const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reviewSchema = new mongoose.Schema({
    reviewId: { type: Number, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });


reviewSchema.plugin(AutoIncrement, { inc_field: 'reviewId' });


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
