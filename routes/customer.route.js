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
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        email1: req.body.email1,
        email2: req.body.email2,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state, 
        country: req.body.country,
        zipcode: req.body.zipcode,
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
    customer.phone1 = req.body.phone1 || customer.phone1;
    customer.phone2 = req.body.phone2 || customer.phone2;
    customer.email1 = req.body.email1 || customer.email1;
    customer.email2 = req.body.email2 || customer.email2;
    customer.address = req.body.address || customer.address;
    customer.city = req.body.city || customer.city;
    customer.state = req.body.state || customer.state;
    customer.country = req.body.country || customer.country;
    customer.zipcode = req.body.zipcode || customer.zipcode;
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