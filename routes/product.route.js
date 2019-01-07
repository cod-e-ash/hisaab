const express = require('express');
const { Product, validate, validateId } = require('../models/product.model');
const auth = require('../middlewares/auth');
const faker = require('faker');

const router = express.Router();

router.get('/', async (req, res) => {
    let searchQry = {};

    // If Product provided
    if (req.query.name) {
        searchQry['name'] = {$regex : '.*' + req.query.name + '.*', $options: 'i'};
    }
    // If Company provided
    if (req.query.company) {
        searchQry['company'] = {$regex : '.*' + req.query.company + '.*', $options: 'i'};
    }
    // If only active products
    if (!req.query.stockOpt || req.query.stockOpt==='true') {
        searchQry['stock'] = {$gt: 0};
    }
    
    const totalRecs = await Product.countDocuments(searchQry);
    // Check if any records
    if (totalRecs === 0) {
        return res.status(404).send({error: "No Records Found"});
    }

    const totalPages = Math.ceil(totalRecs / 10);
    const curPage = +req.query.page || 1;

    // Check of page number
    if (curPage > totalPages || curPage < 1) {
        return res.status(404).send({error: "Page Not Found"});
    }
    
    const skipRecs = 10*(curPage-1);
    const products = await Product
                    .find(searchQry)
                    .skip(skipRecs)
                    .limit(10);
    
    res.status(200).send({totalRecs: totalRecs, totalPages: totalPages, curPage: curPage, products: products});
});

router.get('/:id', async (req, res) => {
    error = validateId(req.params.id);
    if (error) return res.status(400).send(error); 

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Product not found");
    res.status(200).send(product);
});

router.post('/fake', async (req, res) => {
    let fake_data = [];
    for(i=0;i<7;i++) {
        let price = faker.commerce.price();
        let product = Product ({
            name: faker.commerce.productName(),
            company: faker.company.companyName(),
            code: faker.random.number({min:10001, max:99999}) ,
            hsn: faker.random.alphaNumeric(4).toUpperCase(),
            variant: faker.commerce.productAdjective(),
            size: faker.random.arrayElement(['','XS', 'S', 'M', 'L', 'XL', 'XXL']),
            unit: 'pieces',
            price: faker.commerce.price(),
            mrp: price + (price * faker.random.number({min:0.1, max:0.4})),
            margin: 10,
            stock: faker.commerce.price(),
            taxrate: faker.random.arrayElement(
                ['Exempted', 'GST@5', 'GST@8', 'GST@12', 'GST@18', 
                'GST@28', 'IGST@5', 'IGST@8', 'IGST@12', 'IGST@18', 'IGST@28'])
        });
        await product.save();
    }
    res.status(201).send('Random Products Created!');
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
        mrp: req.body.mrp,
        margin: req.body.margin,
        stock: req.body.stock || 0,
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
    old_product.mrp = req.body.mrp || old_product.mrp;
    old_product.margin = req.body.margin || old_product.margin;
    old_product.stock = req.body.stock === 0 ? 0 : req.body.stock || old_product.stock;
    old_product.taxrate = req.body.taxrate || old_product.taxrate;

    await old_product.save();
    res.status(200).send(old_product);
});

router.delete('/:id', auth, async (req,res) => {
    error = validateId(req.params.id);
    if (error) return res.status(400).send(error.message); 
    
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
        return res.status(404).send({error:'Product not found!'});
    }
    res.status(200).send({product: product});
});

module.exports = router;