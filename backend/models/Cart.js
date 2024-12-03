const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const cartSchema = new mongoose.Schema({
    cartId: { type: Number, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }]
});

cartSchema.plugin(AutoIncrement, { inc_field: 'cartId', start_seq: 1 });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
