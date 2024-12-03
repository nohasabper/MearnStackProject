const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true },
    image: { type: String, required: true }, 
    name: { type: String, required: true },
    newPrice: { type: Number, required: true }, // Changed price to newPrice
    deletedPrice: { type: Number }, // Previous price (optional)
    category: { type: Number, ref: 'Category', required: true }, // Category reference
    stock: { type: Number, required: true },
    description: { type: String },
    offer: { type: String }, // Additional field for offers
    rating: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }, // Customer rating
    
});

productSchema.plugin(AutoIncrement, { inc_field: 'productId', start_seq: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
