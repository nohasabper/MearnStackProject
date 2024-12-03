const Offer = require('../models/offers');
const path = require('path');

// Create a new offer
exports.createOffer = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newOffer = await Offer.create({
            name,
            price,
            image: imagePath,
        });

        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find();  // Changed to `offers` for clarity
        res.status(200).json(offers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an offer
exports.updateOffer = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let updateData = { name, description, price, category, stock };

        if (req.file) {
            updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedOffer) {
            return res.status(404).json({ error: 'Offer not found' });
        }

        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
