const Cart = require('../models/cart');
const Product = require('../models/product');

// Create or Update Cart
exports.createOrUpdateCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.body.userId });

        if (cart) {
            // Update existing cart
            cart.products = req.body.products;
            cart.totalPrice = req.body.totalPrice;
            await cart.save();
            return res.status(200).json({ message: 'Cart updated successfully', cart });
        } else {
            // Create a new cart
            const newCart = new Cart({
                user: req.body.userId,
                products: req.body.products,
                totalPrice: req.body.totalPrice
            });
            await newCart.save();
            return res.status(201).json({ message: 'Cart created successfully', cart: newCart });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get a Cart by User ID
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete Cart
exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.status(204).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Add Product to Cart
exports.addProductToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [{ product: productId, quantity }],
                totalPrice: 0, // Placeholder; totalPrice calculation should be done later
            });
        } else {
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
        }

        await cart.save();
        return res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Remove Product from Cart
exports.removeProductFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter(product => product.product.toString() !== productId);

        await cart.save();
        return res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
