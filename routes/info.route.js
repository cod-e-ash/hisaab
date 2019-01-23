const express = require('express');
const { Order } = require('../models/order.model');
const { Customer } = require('../models/customer.model');
const { Product } = require('../models/product.model');
const router = express.Router();

router.get('/orderstatus', async (req, res) => {

    // Group By Status and then Count, sum up revenue and total tax
    const status = await Order
    .aggregate([
        {$group: {
            _id: '$status',
            count: {$sum: 1},
            revenue: {$sum: '$finalamount'},
            tax: {$sum: '$totaltax'}
        }}
    ]);
    if (!status) return res.status(404).send('Not Found');
    res.status(200).send(status);
});

router.get('/clients', async (req, res) => {

    // Group By Status and then Count, sum up revenue and total tax
    const clientGroups = await Customer
    .aggregate([
        {$group: {
            _id: '$type',
            count: {$sum: 1}
        }}
    ]);
    if (!clientGroups) return res.status(404).send('Not Found');
    res.status(200).send(clientGroups);
});

router.get('/products', async (req, res) => {

    // Group By Status and then Count, sum up revenue and total tax
    const count = await Product.estimatedDocumentCount();
    if (!count) return res.status(404).send('Not Found');
    res.status(200).json({"count":count});
});

module.exports = router;