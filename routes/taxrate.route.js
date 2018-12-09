const express = require('express');
const { TaxRate, validateTaxRate } = require('../models/taxrate.model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        taxrates = await TaxRate.find();
        res.status(200).send(taxrates);
    }
    catch {
        res.status(200).send("No Tax Rates in database");
    }
    return;
});

router.get('/:name', async (req, res) => {
    try {
        taxrates = await TaxRate.find({name: req.params.name});
        if (!taxrates) return res.status(404).send('Tax Rate not found!');
        res.status(200).send(taxrates);
    }
    catch {
        res.status(500).send("No Tax Rates in database");
    }
    return;
});

router.delete('/:id', async (req, res) => {
    try {
        taxrates = await TaxRate.deleteOne({"_id": req.params.id});
        if (!taxrates) return res.status(404).send('Tax Rate not found!');
        res.status(200).send("Tax Rate deleted!");
    }
    catch {
        res.status(500).send("No Tax Rates in database");
    }
    return;
});

router.post('/', async (req, res) => {
    const { error } = validateTaxRate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let taxrate = TaxRate({
        name: req.body.name,
        rate: req.body.rate
    });

    await taxrate.save()
    res.status(201).send(taxrate);
});

router.put('/:name', async (req, res) => {
    const { error } = validateTaxRate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await TaxRate.updateOne({name: req.params.name}, {
        $set: {
            name: req.body.name,
            rate: req.body.rate
        }
    });

    if (!result) return res.status(404).send("Record not found!");
    res.send("Record Updated!");
});


module.exports = router;