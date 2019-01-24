const express = require('express');
const { Order } = require('../models/order.model');
const { Customer } = require('../models/customer.model');
const { Product } = require('../models/product.model');
const router = express.Router();

router.get('/orderinfo', async (req, res) => {

    let matchCond = {};

    matchCond['year'] = {$eq : +req.query.year || new Date().getFullYear()};

    if (req.query.month) {
        matchCond['month'] = {$eq : +req.query.month};
    } 
    else {
        if (req.query.startmonth) {
            matchCond['$and'] = 
            [{'month': {'$gte': +req.query.startmonth}}, 
             {'month': {'$lte' : +req.query.endmonth || +req.query.startmonth}}];
        }
    }
    
    // Group By Status and then Count, sum up revenue and total tax
    const status = await Order
    .aggregate([
        { $project: {
            _id: '$_id',
            status: '$status',
            finalamount: '$finalamount',
            totaltax: '$totaltax',
            year: { $year : '$date'},
            month: { $month: '$date' }
        }},
        {
            $match: matchCond
        },
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

router.get('/taxforyear', async (req, res) => {

    let curYear = req.params.year || new Date().getFullYear();

    const monthTax = Order.aggregate([
        {
            $match: {} 
        }
    ]);

});

module.exports = router;