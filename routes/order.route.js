const express = require('express');
const { Order, validate, validateId } = require('../models/order.model');
const debug = require('debug')('app:order');
const auth = require('../middlewares/auth');
const faker = require('faker');


const router = express.Router();

router.get('/', async (req, res) => {
    let searchQry = {};
    // If Order provided
    if (req.query.orderno) {
        searchQry['orderno'] = {$regex : '.*' + req.query.orderno + '.*', $options: 'i'};
    }
    // If Customer provided
    if (req.query.client) {
        searchQry['customername'] = {$regex : '.*' + req.query.client + '.*', $options: 'i'};
    }
    // If only active orders
    if (!req.query.statusOpt || req.query.statusOpt==='true') {
        searchQry['status'] = {$ne: 'Completed'};
    }
    // If From Date & To Date provided
    if (req.query.fromDate && req.query.toDate) {
        searchQry['date'] = {"$gte": new Date(req.query.fromDate), "$lte": new Date(req.query.toDate) };
    } else {
        // Only From Date
        if (req.query.fromDate) {
            searchQry['date'] = {"$gte": new Date(req.query.fromDate)};
        }
        //Only To Date
        if (req.query.toDate) {
            searchQry['date'] = {"$lte": new Date(req.query.toDate)};
        }
    }
    const totalRecs = await Order.countDocuments(searchQry);
    // Check if any records
    if (totalRecs === 0) {
        return res.status(404).send({error: "No Records Found"});
    }

    const totalPages = Math.ceil(totalRecs / 10);
    const curPage = +req.query.page || 1;

    // Check of page number
    if (curPage > totalPages || curPage < 1) {
        return res.status(404).send({error: "Page Not Found"});
    }
    
    const skipRecs = 10*(curPage-1);
    const orders = await Order
                    .find(searchQry)
                    .skip(skipRecs)
                    .limit(10)
                    .populate({
                        path: 'customer',
                    })
                    .populate('details.product')
                    .sort({date:-1});
    
    res.status(200).send({totalRecs: totalRecs, totalPages: totalPages, curPage: curPage, orders: orders});
});


router.post('/fake', async (req, res) => {
    for(i=0;i<7;i++) {
        let order = Order ({
            orderno: faker.random.number({min:10001, max:99999}),
            date: faker.date.past(),
            customername: faker.company.companyName(),
            customer: faker.random.arrayElement([
                '5c31a8f00ca3b41b80c68bb6', '5c31a8f10ca3b41b80c68bb9', '5c31a8f20ca3b41b80c68bbe',
                '5c31a8f20ca3b41b80c68bc0', '5c31a8f30ca3b41b80c68bc3', '5c31a8f30ca3b41b80c68bc4'
            ]),
            total: faker.random.number({min:100, max:99999}),
            discountrate: faker.random.number({min:0, max:15}),
            discount: faker.random.number({min:0, max:100}),
            totaltax: faker.random.number({min:0, max:100}),
            finalamount: faker.random.number({min:100, max:99999}),
            status: faker.random.arrayElement(['Pending', 'Completed']),
            details: {
                itemno: faker.random.number({min:1, max:100}),
                product: faker.random.arrayElement([
                    '5c3ff051a0ea4f2914243c2f', '5c3ff051a0ea4f2914243c30', '5c3ff051a0ea4f2914243c31',
                    '5c3ff051a0ea4f2914243c32', '5c3ff051a0ea4f2914243c33', '5c3ff051a0ea4f2914243c34'
                ]),
                price: faker.random.number({min:1, max:999}),
                quantity: faker.random.number({min:1, max:999}),
                discountrate: faker.random.number({min:0, max:15}),
                discount: faker.random.number({min:0, max:100}),
                tax: faker.random.number({min:1, max:100}),
                total: faker.random.number({min:1, max:99999}),
            }
        });
        await order.save();
    }
    res.status(201).send('Random Orders Created!');
});


router.get('/:id', async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Order Id!");

    const order = await Order.findById(req.params.id).populate('customer').populate(details.product);
    if (!order) return res.status(400).send("No order found!");
    res.status(200).send(order);
});

router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let orderNo = await Order.estimatedDocumentCount();
    orderNo += 101;

    const order = Order({
        orderno: orderNo,
        date: new Date,
        customername: req.body.customername,
        customer: req.body.customer,
        total: req.body.total,
        discountrate: req.body.discount,
        discount: req.body.discountamount,
        totaltax: req.body.totaltax,
        finalamount: req.body.finalamount,
        status: 'Pending',
        details: req.body.details
    });

    await order.save();
    res.status(201).send(order);
});

router.put('/:id', auth, async (req, res) => {
    const err = validateId(req.params.id);
    if (err) return res.status(404).send("Invalid Order Id!");

    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let order = await Order.findOne({"_id":req.params.id});
    if (!order) return res.status(400).send("Order not found!");

    order.customername = req.body.customername || order.customername;
    order.customer = req.body.customer || order.customer;
    order.total = req.body.total || order.total;
    order.discountrate = req.body.discountrate || order.discountrate;
    order.discount = req.body.discount || order.discount;
    order.totaltax = req.body.totaltax || order.totaltax;
    order.finalamount = req.body.finalamount || order.finalamount;
    order.details = req.body.details || order.details;

    await order.save();
    order = await Order.find({"_id":req.params.id})
                .populate({
                    path: 'customer',
                })
                .populate('details.product')
    res.status(200).send(order);
});

router.delete('/:id', auth, async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Order Id!");

    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order) res.status(400).send("Order not found!");
    res.status(200).send(order);
});

module.exports = router;