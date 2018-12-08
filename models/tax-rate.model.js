const mongoose = require('mongoose');

const TaxRate = mongoose.Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true, default: 0.0 }
});

function validateTaxRate(taxrate) {
    const taxRateSchema = {
        name: Joi.string().required(),
        rate: Joi.number().required()
    }

    return Joi.validate(taxrate, taxRateSchema);
}

exports = mongoose.model('TaxRate', TaxRate);
exports.validate = validateTaxRate;