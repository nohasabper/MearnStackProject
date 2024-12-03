const { default: mongoose } = require('mongoose');
const Order = require('../models/order');

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && (id.length === 24);
};

exports.createOrder = async (req, res) => {
    try {
        console.log("Received order data:", req.body);

        const { user, name, email, address, phone, notes, paymentMethod, products, totalAmount, shipping } = req.body;

        if (!name || !address || !phone || !paymentMethod || !products || !totalAmount || !user) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const orderData = {
            user,
            name,
            email,
            address,
            phone,
            notes,
            paymentMethod,
            products: products.map(item => {
                if (!isValidObjectId(item.product)) {
                    throw new Error(`Invalid product ID: ${item.product}`);
                }
                return {
                    product: new mongoose.Types.ObjectId(item.product),
                    quantity: item.quantity
                };
            }),
            totalAmount,
            shipping
        };

        const newOrder = await Order.create(orderData);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error); 
        res.status(400).json({ error: error.message });
    }
};


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ isSubmitted: false })
            .populate('user')
            .populate('products.product');

        const formattedOrders = orders.map(order => ({
            _id: order._id, // Ensure you are including the _id here
            orderId: order.orderId,
            userName: order.user ? order.user.name : 'N/A',
            name: order.name,
            email: order.email,
            address: order.address,
            phone: order.phone,
            notes: order.notes,
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount,
            shipping: order.shipping,
            products: order.products.map(product => ({
                productName: product.product.name,
                quantity: product.quantity,
                price: product.product.price,
            })),
            orderDate: order.orderDate,
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Get a single order (by ID)
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; 
        const orders = await Order.find({ user: userId }).populate('products.product'); // Find orders for the user
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        const formattedOrders = orders.map(order => ({
            id: order._id, 
            products: order.products,
            totalAmount: order.totalAmount,
            isSubmitted: order.isSubmitted,
        }));
        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.updateOrder = async (req, res) => {
    try {
        const { isSubmitted } = req.body; 
        const order = await Order.findById(req.params.id);  // Use MongoDB _id

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (isSubmitted !== undefined) {
            order.isSubmitted = isSubmitted;  // Update isSubmitted status
            await order.save();
        }

        res.status(200).json(order);  // Return updated order
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Delete an order (for admin)
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.updateStauts=async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isSubmitted = true;  // Set the order as submitted
        await order.save();

        res.status(200).json({ message: 'Order submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// In orderController.js

// In orderController.js
exports.confirmOrder = async (req, res) => {
    try {
        const orderId = req.params.id;  // Use the MongoDB _id here
        const order = await Order.findById(orderId);  // Find by _id, not orderId

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order to mark it as submitted
        order.isSubmitted = true;
        await order.save();

        // Return the updated order
        res.status(200).json(order);  // Ensure the order is returned with all necessary fields
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Get all submitted orders
exports.getSubmittedOrders = async (req, res) => {
    try {
        const submittedOrders = await Order.find({ isSubmitted: true })
            .populate('user')
            .populate('products.product');

        const formattedOrders = submittedOrders.map(order => ({
            _id: order._id,
            orderId: order.orderId,
            userName: order.user ? order.user.name : 'N/A',
            name: order.name,
            email: order.email,
            address: order.address,
            phone: order.phone,
            notes: order.notes,
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount,
            shipping: order.shipping,
            products: order.products.map(product => ({
                productName: product.product.name,
                quantity: product.quantity,
                price: product.product.price,
            })),
            orderDate: order.orderDate,
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
