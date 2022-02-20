import mongoose  from 'mongoose';

const TaxRateSchema = mongoose.Schema({
    name: { type: String, required: true },
    rate: { type: Number, required: true, default: 0.0, min: 0, max: 100 }
});

function validateTaxRate(taxrate) {
    if(!taxrate || taxrate.name || taxrate.rate) return false;
    if(taxrate.name.length < 2 || taxrate.name.length > 20) return false;
    if(taxrate.rate < 0 || taxrate.rate > 100) return false;
    return true;
}

const model = mongoose.model('TaxRate', TaxRateSchema);

export {model as TaxRate, validateTaxRate}