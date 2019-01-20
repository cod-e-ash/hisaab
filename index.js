require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./startup');
const taxRoutes = require('./routes/taxrate.route');
const productRoutes = require('./routes/product.route');
const customerRoutes = require('./routes/customer.route');
const orderRoutes = require('./routes/order.route');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const infoRoutes = require('./routes/info.route');
const errorHandler = require('./middlewares/error-handler');
const logger = require('./helpers/logger');

const app = express();

process.on("uncaughtException", (error) => {
    logger.error(error.message, error);
});
process.on("unhandledRejection", (error) => {
    throw error;
});

connectDB();

// Express Config Settings
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization, User, x-auth-token');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Routes
app.use('/api/taxrates', taxRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/info', infoRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`));