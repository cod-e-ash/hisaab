const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { User } = require('../models/user.model');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username:req.body.username});
    if (!user) return res.status(400).send("Invalid User or password!");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send("Invalid User or password!");

    const token = user.genAuthToken();
    res.send(token);
});

function validate(user) {
    const schema = {
        username : Joi.string().min(4).max(20).required(),
        password: Joi.string().min(5).max(20).required()
    }
    
    return Joi.validate(user, schema);
}

module.exports = router;