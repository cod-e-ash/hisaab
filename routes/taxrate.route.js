const express = require('express');
const { TaxRate, validateTaxRate } = require('../models/taxrate.model');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const taxrates = await TaxRate.find();
    res.status(200).send(taxrates);
});

router.get('/:name', async (req, res) => {
    const taxrates = await TaxRate.find({name: req.params.name});
    if (!taxrates) return res.status(404).send('Tax Rate not found!');
    res.status(200).send(taxrates);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateTaxRate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const taxrate = TaxRate({
        name: req.body.name,
        rate: req.body.rate
    });

    await taxrate.save()
    res.status(201).send(taxrate);
});

router.put('/:name', auth, async (req, res) => {
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

router.delete('/:name', auth, async (req, res) => {
    const taxrates = await TaxRate.deleteOne({"name": req.params.name});
    if (!taxrates) return res.status(404).send('Tax Rate not found!');
    res.status(200).send("Tax Rate deleted!");
});

module.exports = router;