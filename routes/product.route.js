const express = require('express');
const { Product, validate } = require('../models/product.model');

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.send(products)
});

router.post('/', async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const product = Product({
        name: req.body.name;
    })
});