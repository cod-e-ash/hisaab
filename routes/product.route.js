const express = require('express');
const { Product, validate, validateId } = require('../models/product.model');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.status(200).send(products);
});

router.get('/:id', async (req, res) => {
    error = validateId(req.params.id);
    if (error) return res.status(400).send(error); 

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Product not found");
    res.status(200).send(product);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
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
        status: true,
        taxrate: req.body.taxrate
    });
    await product.save();
    res.status(201).send(product);
});

router.put('/:id', auth, async (req, res) => {
    error = validateId(req.params.id);
    if (error) return res.status(400).send(error.message);

    const old_product = await Product.findOne({"_id" : req.params.id});
        
    if (!old_product) return res.status(404).send("No Product Found");

    old_product.name = req.body.name || old_product.name;
    old_product.company = req.body.company || old_product.company;
    old_product.code = req.body.code || old_product.code;
    old_product.hsn = req.body.hsn || old_product.hsn;
    old_product.variant = req.body.variant || old_product.variant;
    old_product.size = req.body.size || old_product.size;
    old_product.unit = req.body.unit || old_product.unit;
    old_product.price = req.body.price || old_product.price;
    old_product.margin = req.body.margin || old_product.margin;
    old_product.status = req.body.status || old_product.status;
    old_product.taxrate = req.body.taxrate || old_product.taxrate;

    await old_product.save();
    res.status(200).send(old_product);
});

router.delete('/:id', auth, async (req,res) => {
    error = validateId(req.params.id);
    if (error) return res.status(400).send(error.message); 
    
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(400).send('Product not found!');
    res.status(200).send("Record deleted!");
});

module.exports = router;