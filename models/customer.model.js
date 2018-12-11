const mongoose = require('mongoose');
const Joi = require('joi');
const validateObjectId = require('../helpers/validateObjectId');

const Customer = mongoose.Schema({
    name: {type: String, required: true, min: 5 },
    address: {type: String, require: true },
    phone: { type:String, require: true },
    gstn: { type: String },
    pan: { type: String }
});

function validateCustomer(customer) {
    const customerSchema = {
        name: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        gstn: Joi.string(),
        pan: Joi.string()
    }
    return Joi.validate(customer, customerSchema);
}

function validateId(customerId) {
    return validateObjectId(customerId, "Customer");
}

module.exports.Customer = mongoose.model('Customer', Customer);
module.exports.validate = validateCustomer;
module.exports.validateId = validateId;
