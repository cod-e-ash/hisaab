import mongoose from 'mongoose';
import validateObjectId from '../helpers/validateObjectId.js';

const CustomerSchema = mongoose.Schema({
    name: {type: String, required: true, min: 5 },
    phone1: { type:String, require: true },
    phone2: { type:String},
    email1: { type:String},
    email2: { type:String},
    address: {type: String, require: true },
    city: {type: String, require: true },
    state: {type: String},
    country: {type: String, require: true },
    zipcode: {type: String, require: true },
    gstn: { type: String },
    pan: { type: String },
    type: { type: String, required: true }

});

function validateCustomer(customer) {
    if(!customer) return false;
    if(!customer.name || customer.name.length < 5 || customer.name.length > 30) return false;
    if(!customer.phone1 || customer.phone1.length < 10 || customer.phone1.length > 15) return false;
    if(customer.phone2 && (customer.phone2.length < 10 || customer.phone2.length > 15)) return false;
    if(customer.email1 && (customer.email1.length < 5 || customer.email1.length > 30)) return false;
    if(customer.email2 && (customer.email2.length < 5 || customer.email2.length > 30)) return false;
    if(!customer.address || customer.address.length < 5 || customer.address.length > 30) return false;
    if(!customer.city || customer.city.length < 5 || customer.city.length > 30) return false;
    if(customer.state && (customer.state.length < 5 || customer.state.length > 30)) return false;
    if(!customer.country || customer.country.length < 5 || customer.country.length > 30) return false;
    if(!customer.zipcode || customer.zipcode.length < 5 || customer.zipcode.length > 30) return false;
    if(customer.gstn && (customer.gstn.length < 5 || customer.gstn.length > 30)) return false;
    if(customer.pan && (customer.pan.length < 5 || customer.pan.length > 30)) return false;
    if(!customer.type || customer.type.length < 5 || customer.type.length > 30) return false;
    return true;

}

function validateId(customerId) {
    return validateObjectId(customerId, "Customer");
}

const Customer = mongoose.model('Customer', CustomerSchema);

export { Customer as Customer, validateCustomer as validate, validateId};
