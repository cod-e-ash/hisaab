const mongoose = require('mongoose');

const TaxRate = mongoose.Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true, default: 0.0 }
});

exports = mongoose.model('TaxRate', TaxRate);