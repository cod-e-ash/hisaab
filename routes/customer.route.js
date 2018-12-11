const express = require('express');
const {Customer, validate, validateId} = require('../models/customer.model');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    if (!customers) return res.status(400).send("No Customer found!");
    res.status(200).send(customers);
});

router.get('/:id', async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Customer Id!");

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(400).send("Cutomer Not Found");
    res.status(200).send(customer);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = Customer({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        gstn:  req.body.gstn,
        pan: req.body.pan
    });

    await customer.save();
    res.status(201).send(customer);
});

router.put('/:id', auth, async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Customer Id!");

    let customer = await Customer.findOne({"_id":req.params.id});
    customer.name = req.body.name || customer.name;
    customer.address = req.body.address || customer.address;
    customer.phone = req.body.phone || customer.phone;
    customer.gstn = req.body.gstn || customer.gstn;
    customer.pan = req.body.pan || customer.pan;

    await customer.save();
    res.status(200).send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Customer Id!");

    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(400).send("Customer not found!");
    res.status(200).send(customer);
});

module.exports = router;