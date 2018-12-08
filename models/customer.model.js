const mongoose = require('mongoose');

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

module.exports = mongoose.model('Customer', Customer);
exports.validate = validateCustomer;
