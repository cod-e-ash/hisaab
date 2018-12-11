const express = require('express');
const { Invoice, validate, validateId } = require('../models/invoice.model');
const debug = require('debug')('app:invoice');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        if (!invoices) return res.status(400).send("No Invoice found!");
        res.status(200).send(invoices);
    }
    catch(error) {
        res.status(500).send("Internal server error!");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const error = validateId(req.params.id);
        if (error) return res.status(404).send("Invalid Invoice Id!");

        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(400).send("No invoice found!");
        res.status(200).send(invoice);
    }
    catch(error) {
        res.status(500).send("Internal server error!");
    }
});

router.post('/', async (req, res) => {
    // try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const invoice = Invoice({
            billno: req.body.billno,
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

        await invoice.save();
        res.status(201).send(invoice);
    // }
    // catch(error) {
    //     debug(error);
    //     res.status(500).send("Internal server error!");
    // }
});

module.exports = router;