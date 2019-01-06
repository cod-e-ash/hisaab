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
    // If Company provided
    if (req.query.client) {
        searchQry['client'] = {$regex : '.*' + req.query.client + '.*', $options: 'i'};
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
                    .limit(10);
    
    res.status(200).send({totalRecs: totalRecs, totalPages: totalPages, curPage: curPage, orders: orders});
});


router.post('/fake', async (req, res) => {
    let fake_data = [];
    for(i=0;i<7;i++) {
        let order = Order ({
            orderno: faker.random.number({min:10001, max:99999}),
            date: faker.date.past(),
            custid: faker.random.number({min:10001, max:99999}),
            client: faker.company.companyName(),
            total: faker.random.number({min:100, max:99999}),
            discount: faker.random.number({min:0, max:15}),
            discountamount: faker.random.number({min:0, max:100}),
            totaltax: faker.random.number({min:0, max:100}),
            pkgdly: faker.random.number({min:0, max:100}),
            status: faker.random.arrayElement(['Pending', 'Completed']),
            finalamount: faker.random.number({min:100, max:99999}),
            details: {
                itemno: faker.random.number({min:1, max:100}),
                name: faker.commerce.productName(),
                hsn : faker.random.alphaNumeric(4).toUpperCase(),
                mrp : faker.commerce.price(),
                quantity: faker.random.number({min:1, max:999}),
                margin: 10,
                discountpercentage: faker.random.number({min:0, max:15}),
                discountamount: faker.random.number({min:0, max:100}),
                rate: faker.random.number({min:1, max:9999}),
                taxrate: faker.random.arrayElement(['Exempted', 'GST@5', 'GST@8', 'GST@12', 'GST@18', 
                'GST@28', 'IGST@5', 'IGST@8', 'IGST@12', 'IGST@18', 'IGST@28']),
                taxamount: faker.random.number({min:1, max:100}),
                totalamount: faker.random.number({min:1, max:99999}),
            }
        });
        await order.save();
    }
    res.status(201).send('Random Orders Created!');
});


router.get('/:id', async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Order Id!");

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(400).send("No order found!");
    res.status(200).send(order);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const order = Order({
        orderno: req.body.orderno,
        date: req.body.date,
        custid: req.body.custid,
        total: req.body.total,
        discount: req.body.discount,
        discountamount: req.body.discountamount,
        totaltax: req.body.totaltax,
        pkgdly: req.body.pkgdly,
        finalamount: req.body.finalamount,
        details: req.body.details
    });

    await order.save();
    res.status(201).send(order);
});

router.put('/:id', auth, async (req, res) => {
    const err = validateId(req.params.id);
    if (err) return res.status(404).send("Invalid Order Id!");

    const { error } = validate(req.body);
    if (error) return res.status(400).send("Invalid data!");

    let order = await Order.findOne({"_id":req.params.id});
    if (!order) return res.status(400).send("Order not found!");

    order.orderno = req.body.orderno || order.orderno;
    order.date = req.body.date || order.date;
    order.custid = req.body.custid || order.custid;
    order.total = req.body.total || order.total;
    order.discount = req.body.discount || order.discount;
    order.discountamount = req.body.discountamount || order.discountamount;
    order.totaltax = req.body.totaltax || order.totaltax;
    order.pkgdly = req.body.pkgdly || order.pkgdly;
    order.finalamount = req.body.finalamount || order.finalamount;
    order.details = req.body.details || order.details;

    await order.save();
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