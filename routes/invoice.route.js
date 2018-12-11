const express = require('express');
const { Invoice, validate, validateId } = require('../models/invoice.model');
const debug = require('debug')('app:invoice');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const invoices = await Invoice.find();
    if (!invoices) return res.status(400).send("No Invoice found!");
    res.status(200).send(invoices);
});

router.get('/:id', async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Invoice Id!");

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(400).send("No invoice found!");
    res.status(200).send(invoice);
});

router.post('/', auth, async (req, res) => {
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
});

router.put('/:id', auth, async (req, res) => {
    const err = validateId(req.params.id);
    if (err) return res.status(404).send("Invalid Invoice Id!");

    const { error } = validate(req.body);
    if (error) return res.status(400).send("Invalid data!");

    let invoice = await Invoice.findOne({"_id":req.params.id});
    if (!invoice) return res.status(400).send("Invoice not found!");

    invoice.billno = req.body.billno || invoice.billno;
    invoice.date = req.body.date || invoice.date;
    invoice.custid = req.body.custid || invoice.custid;
    invoice.total = req.body.total || invoice.total;
    invoice.discount = req.body.discount || invoice.discount;
    invoice.discountamount = req.body.discountamount || invoice.discountamount;
    invoice.totaltax = req.body.totaltax || invoice.totaltax;
    invoice.pkgdly = req.body.pkgdly || invoice.pkgdly;
    invoice.finalamount = req.body.finalamount || invoice.finalamount;
    invoice.details = req.body.details || invoice.details;

    await invoice.save();
    res.status(200).send(invoice);
});

router.delete('/:id', auth, async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Invoice Id!");

    const invoice = await Invoice.findByIdAndRemove(req.params.id);
    if (!invoice) res.status(400).send("Invoice not found!");
    res.status(200).send(invoice);
});

module.exports = router;