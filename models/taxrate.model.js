const Joi = require('joi');
const mongoose = require('mongoose');

const TaxRate = mongoose.Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true, default: 0.0, min: 0, max: 100 }
});

function validateTaxRate(taxrate) {
    const taxRateSchema = {
        name: Joi.string().required(),
        rate: Joi.number().required().min(0).max(100)
    };

    return Joi.validate(taxrate, taxRateSchema);
};

exports.TaxRate = mongoose.model('TaxRate', TaxRate);
exports.validateTaxRate = validateTaxRate;