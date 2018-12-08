const mongoose = require('mongoose');

const Customer = mongoose.Schema({
    name: {type: String, required: true, min: 5 },
    address: {type: String, require: true },
    phone: { type:String, require: true },
    gstn: { type: String },
    pan: { type: String }
});

module.exports = mongoose.model('Customer', Customer);