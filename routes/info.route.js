import express from 'express';
import { Order } from '../models/order.model.js';
import { Customer } from '../models/customer.model.js';
import { Product } from '../models/product.model.js';

const taxRoutes = express.Router();

taxRoutes.get('/orders', async (req, res) => {
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

taxRoutes.get('/clients', async (req, res) => {

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

taxRoutes.get('/products', async (req, res) => {

    // Group By Status and then Count, sum up revenue and total tax
    const count = await Product.estimatedDocumentCount();
    if (!count) return res.status(404).send('Not Found');
    res.status(200).json({"count":count});
});

taxRoutes.get('/tax', async (req, res) => {

    let matchCond = {};
    if (!req.query.startyear || !req.query.startmonth || 
        !req.query.endyear || !req.query.endmonth) {
            return res.status(400).send('Bad Request - Enter proper dates');
        }
    const startDate = new Date(`${req.query.startyear}-${req.query.startmonth}-01`);
    const endDate = new Date(+req.query.endyear, +req.query.endmonth,0);

    if (req.query.startyear) {
        matchCond['$and'] = 
        [{'date': {'$gte': startDate}},
         {'date': {'$lte' : endDate}}];
    }
    
    const orders = await Order.aggregate([
        { $project: {
            _id: '$_id',
            orderno: '$orderno',
            status: '$status',
            totaltax: '$totaltax',
            details: '$details',
            date: '$date'
        }},
        {
            $match: matchCond
        },
        {
            $unwind: "$details"
        },
        {
            $project: {
                orderno: '$orderno',
                product: '$details.product',
                taxrate: '$details.taxrate',
                taxamount: '$details.tax',
                amount:'$details.total',
            }
        },
        {
            $group: {
                _id: "$taxrate",
                amount: {$sum:'$amount'},
                taxamount: {$sum:'$taxamount'}
            }
        },
        {
            $sort: {"_id":1}
        }
    ]);

    res.send(orders);
});

export default taxRoutes;