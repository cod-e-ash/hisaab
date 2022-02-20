import * as express from 'express';
import  { TaxRate, validateTaxRate } from '../models/taxrate.model.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    let searchQry = {};
    // If Code provided
    if(req.query.name) {
        searchQry['name'] = {$regex : '.*' + req.query.name + '.*', $options: 'i'};
    }

    const totalRecs = await TaxRate.countDocuments(searchQry);
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
    const taxRates = await TaxRate
                    .find(searchQry)
                    .skip(skipRecs)
                    .limit(10);
    
    res.status(200).send({totalRecs, totalPages, curPage, taxRates});
});


router.get('/:name', async (req, res) => {
    const taxrate = await TaxRate.find({name: req.params.name});
    if (!taxrate) return res.status(404).send('Tax Rate not found!');
    res.status(200).send(taxrate);
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

export default router;