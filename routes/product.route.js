const express = require('express');
const { Product, validate } = require('../models/product.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.status(200).send(products);
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const product = Product({
        name: req.body.name,
        company: req.body.company,
        code: req.body.code,
        hsn: req.body.hsn,
        variant: req.body.variant,
        size: req.body.size,
        unit: req.body.unit,
        price: req.body.price,
        margin: req.body.margin,
        taxrate: req.body.taxrate
    });

    product.save()
    .then( (product) => {
        res.status(201).send(product);
    })
    .catch( error => {
        res.status(500).send(error);
    });
});

exports.router = router;