const express = require('express');
const { Order } = require('../models/order.model');
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

module.exports = router;