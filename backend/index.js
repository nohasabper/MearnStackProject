// index.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const offerRoutes = require('./routes/offerRoutes');
const cors = require('cors');
const authenticateToken = require('./middlewares/authMiddleware');
const notFoundHandler = require('./middlewares/notFoundMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use all routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', reviewRoutes);
app.use('/api', cartRoutes);
app.use('/api', offerRoutes);
// Use authentication middleware
app.use(authenticateToken); // Make sure this is placed correctly

// 404 Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Donicci:MERN@cluster0.zctmmxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(8080, () => console.log('Server running on port 8080'));
    })
    .catch(err => console.error('MongoDB connection error:', err));
