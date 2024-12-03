const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
    // MongoDB automatically adds an _id field, so you don't need to define it here
    orderId: { type: Number, unique: true },  // This is your custom increment field
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    paymentMethod: { type: String, required: true },
    products: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 40 },
    orderDate: { type: Date, default: Date.now },
    isSubmitted: { type: Boolean, default: false } 
});


orderSchema.plugin(AutoIncrement, { inc_field: 'orderId', start_seq: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
