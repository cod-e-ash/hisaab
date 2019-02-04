const express = require('express');
const {
    Company,
    validateCompany
} = require('../models/company.model');
const router = express.Router();

router.get('', async (req, res) => {
    const company = await Company.findOne();
    if (!company) return res.status(404).send({error:'Company not found'});
    res.status(200).send({company: company});
});

router.post('', async (req, res) => {
    const { error }  = validateCompany(req.body);
    if (error) res.status(400).send({error: error.details[0].message});
    const company = Company({
        name: req.body.name,
        owner: req.body.owner,
        phone: req.body.phone,
        email: req.body.email || '',
        address: req.body.address,
        city: req.body.city,
        state: req.body.state || '',
        country: req.body.country,
        zipcode: req.body.zipcode,
        gstn: req.body.gstn,
        pan: req.body.pan,
        currency: req.body.currency
    });

    await company.save();
    res.status(201).send({company: company});
});

router.put('', async (req, res) => {
    const { error } = validateCompany(req.body);
    if (error) res.status(400).send({error: error.details[0].message});

    const company = await Company.findOne();
    company.name = req.body.name || company.name;
    company.owner = req.body.owner || company.owner;
    company.phone = req.body.phone ||     company.phone; 
    company.email = req.body.email || company.email;
    company.address = req.body.address || company.address;
    company.city = req.body.city || company.city
    company.state = req.body.state || company.state;
    company.country = req.body.country || company.country;
    company.zipcode = req.body.zipcode || company.zipcode;
    company.gstn = req.body.gstn || company.gstn;
    company.pan = req.body.currency || company.currency;
    company.currency = req.body.currency || company.currency;

    await company.save();
    res.status(200).send({company: company});
});

module.exports = router;