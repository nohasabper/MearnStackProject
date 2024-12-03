const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const categorySchema = new mongoose.Schema(
    {
        categoryId: { type: Number, unique: true },
        name: { type: String, required: true },
    }
);

categorySchema.plugin(AutoIncrement, { inc_field: 'categoryId', start_seq: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
