const mongoose = require('mongoose');
const Joi = require('joi');
const validateObjectId = require('../helpers/validateObjectId');

const Customer = mongoose.Schema({
    name: {type: String, required: true, min: 5 },
    phone1: { type:String, require: true },
    phone2: { type:String},
    email1: { type:String},
    email2: { type:String},
    address: {type: String, require: true },
    city: {type: String, require: true },
    state: {type: String},
    country: {type: String, require: true },
    zipcode: {type: String, require: true },
    gstn: { type: String },
    pan: { type: String },
    type: { type: String, required: true }

});

function validateCustomer(customer) {
    const customerSchema = {
        name: Joi.string().required(),
        phone1: Joi.string().required(),
        phone2: Joi.string().optional().allow(''),
        email1: Joi.string().optional().email().allow(''),
        email2: Joi.string().optional().email().allow(''),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string(),
        country: Joi.string().required(),
        zipcode: Joi.string().required(),
        gstn: Joi.string().optional().allow(''),
        pan: Joi.string().optional().allow(''),
        type: Joi.string().required()
    }
    return Joi.validate(customer, customerSchema);
}

function validateId(customerId) {
    return validateObjectId(customerId, "Customer");
}

module.exports.Customer = mongoose.model('Customer', Customer);
module.exports.validate = validateCustomer;
module.exports.validateId = validateId;
