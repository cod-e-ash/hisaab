const express = require('express');
const {Customer, validate, validateId} = require('../models/customer.model');
const router = express.Router();
const auth = require('../middlewares/auth');
const faker = require('faker');


router.get('/', async (req, res) => {
    let searchQry = {};
    // If Customer provided
    if (req.query.name) {
        searchQry['name'] = {$regex : '.*' + req.query.name + '.*', $options: 'i'};
    }
    if (req.query.type) {
        searchQry['type'] = req.query.type;
    } else {
        searchQry['type'] = 'Customer';
    }
    const totalRecs = await Customer.countDocuments(searchQry);
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
    const customers = await Customer
                    .find(searchQry)
                    .skip(skipRecs)
                    .limit(10);
    
    res.status(200).send({totalRecs: totalRecs, totalPages: totalPages, curPage: curPage, customers: customers});
});

router.get('/:id', async (req, res) => {
    const error = validateId(req.params.id);
    if (error) return res.status(404).send("Invalid Customer Id!");

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(400).send("Cutomer Not Found");
    res.status(200).send(customer);
});

router.post('/fake', async (req, res) => {
    let fake_data = [];
    for(i=0;i<7;i++) {
        let customer = Customer ({
            name: faker.company.companyName(),
            phone1: faker.phone.phoneNumber(),
            phone2: faker.random.arrayElement(['','', faker.phone.phoneNumber()]),
            email1: faker.internet.email(),
            email2: faker.random.arrayElement(['','', faker.internet.email()]),
            address: faker.address.streetName(),
            city: faker.address.city(),
            state: faker.address.state(),
            country: faker.address.country(),
            zipcode: faker.address.zipCode(),
            gstn: faker.random.alphaNumeric(11),
            pan: faker.random.alphaNumeric(9),
            type: faker.random.arrayElement(['Customer', 'Supplier'])
        });
        await customer.save();
    }
    res.status(201).send('Random Clients Created!');
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = Customer({
        name: req.body.name,
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