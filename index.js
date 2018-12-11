const config = require('config');
const express = require('express');
const helmet = require('helmet');
const connectDB = require('./startup');
const taxRoutes = require('./routes/taxrate.route');
const productRoutes = require('./routes/product.route');
const customerRoutes = require('./routes/customer.route');
const invoiceRoutes = require('./routes/invoice.route');
const app = express();

connectDB();

// Express Config Settings

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization, User');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Routes
app.use('/api/taxrates', taxRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`));