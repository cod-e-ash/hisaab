const mongoose = require('mongoose');
const Joi = require('joi');

const company = mongoose.Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    phone: { type:String, required: true},
    email: { type:String},
    address: {type: String, require: true },
    city: {type: String, require: true },
    state: {type: String},
    country: {type: String, require: true },
    zipcode: {type: String, require: true },
    gstn: { type: String },
    pan: { type: String },
    currency: {type: String, default: 'INR'}
});

function validateCompany(company) {
    const companySchema = {
        name: Joi.string().required(),
        owner: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().optional().email().allow(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().optional().allow(''),
        country: Joi.string().required(),
        zipcode: Joi.string().required(),
        gstn: Joi.string().default('N/A'),
        pan: Joi.string().optional().allow(''),
        currency: Joi.string()
    }
    return Joi.validate(company,companySchema);
}

module.exports.Company = mongoose.model('Company', company);
module.exports.validateCompany = validateCompany;