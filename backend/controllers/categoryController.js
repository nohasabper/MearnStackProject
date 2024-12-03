const Category = require('../models/category');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const newCategory = await Category.create({
            name: req.body.name,
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    } 

};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single category
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
