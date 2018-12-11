const express = require('express');
const {Customer, validate, validateId} = require('../models/customer.model');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        if (!customers) return res.status(400).send("No Customer found!");
        res.status(200).send(customers);
    }
    catch(error) {
        res.status(500).send("Internal server error!");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const error = validateId(req.params.id);
        if (error) return res.status(404).send("Invalid Customer Id!");

        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(400).send("Cutomer Not Found");
        res.status(200).send(customer);
    }
    catch(error) {
        res.status(500).send("Internal server error!");
    }
});

router.post('/', async (req, res) => {
    try {
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
    }
    catch(error) {
        console.log(error);
        res.status(500).send("Internal server error!");
    }
});

router.put('/:id', async (req, res) => {
    try {
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
    }
    catch(error) {
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const error = validateId(req.params.id);
        if (error) return res.status(404).send("Invalid Customer Id!");

        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) return res.status(400).send("Customer not found!");
        res.status(200).send(customer);
    }
    catch(error) {
        res.status(500).send("Internal server error!");
    }
});

module.exports = router;