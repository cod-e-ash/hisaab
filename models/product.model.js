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
    stock: { type: Number},
    taxrate: { type: String }
});

function validateProduct(product) {
    const productSchema = {
        name: Joi.string().min(3).max(100).required(),
        company: Joi.string().min(3).max(100).required(),
        code: Joi.string(),
        hsn: Joi.string().optional(),
        variant: Joi.string().allow('').optional(),
        size: Joi.string().allow('').optional(),
        unit: Joi.string().allow('').optional(),
        price: Joi.number().required(),
        margin: Joi.number().optional(),
        stock: Joi.number(),
        taxrate: Joi.string().required()
    }

    return Joi.validate(product, productSchema);
}

function validateId(objectId) {
    return validateObjectId(objectId,"Product");
}

module.exports.Product = mongoose.model('Product', Product);
module.exports.validate = validateProduct; 
module.exports.validateId = validateId; 