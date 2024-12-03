// models/offer.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const offerSchema = new mongoose.Schema({
    offerId: { type: Number, unique: true },
    image: { type: String, required: true }, 
    name: { type: String, required: true },
    price: { type: Number, required: true },
    deletedPrice:{type:Number}
});

offerSchema.plugin(AutoIncrement, { inc_field: 'offerId', start_seq: 1 });

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
