const mongoose = require('mongoose');
const Joi = require('joi');

const Product = mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    code: { type: String },
    hsn: { type: String },
    variant: { type: String },
    size: { type: String },
    unit: { type: String },
    price: { type: Number, required: true },
    margin: { type: Number, required: true },
    taxRate: { type: [String] }
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
        margin: Joi.number()
    }

    return Joi.validate(product, productSchema);
}

module.exports = mongoose.model('Product', Product);
exports.validate = validateProduct; 