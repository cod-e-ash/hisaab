const mongoose = require('mongoose');
const Joi = require('joi');
const validateObjectId = require('../helpers/validateObjectId');

const Product = mongoose.Schema({
    code: { type: String },
    name: { type: String, required: true },
    company: { type: String, required: true },
    hsn: { type: String },
    size: { type: String },
    variant: { type: String },
    unit: { type: String },
    price: { type: Number, required: true },
    margin: { type: Number, required: true },
    taxrate: { type: [String] }
});

function validateProduct(product) {
    const productSchema = {
        name: Joi.string().min(3).max(100).required(),
        company: Joi.string().min(3).max(100).required(),
        code: Joi.string(),
        hsn: Joi.string(),
        variant: Joi.string(),
        size: Joi.string(),
        unit: Joi.string(),
        price: Joi.number().required(),
        margin: Joi.number(),
        taxrate: Joi.array().optional()
    }

    return Joi.validate(product, productSchema);
}

function validateId(objectId) {
    return validateObjectId(objectId,"Product");
}

module.exports.Product = mongoose.model('Product', Product);
module.exports.validate = validateProduct; 
module.exports.validateId = validateId; 