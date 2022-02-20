import mongoose from 'mongoose';

const CompanySchema = mongoose.Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    phone: { type:String, required: true},
    email: { type:String},
    address: {type: String, require: true },
    city: {type: String, require: true },
    state: {type: String},
    country: {type: String, require: true },
    zipcode: {type: String, require: true },
    gstn: { type: String },
    pan: { type: String },
    currency: {type: String, default: 'INR'}
});

function validateCompany(company) {
    if(!company) return false;
    if(!company.name || company.name.length < 5 || company.name.length > 30) return false;
    if(!company.owner || company.owner.length < 5 || company.owner.length > 30) return false;
    if(!company.phone || company.phone.length < 10 || company.phone.length > 15) return false;
    if(company.email && (company.email.length < 5 || company.email.length > 30)) return false;
    if(!company.address || company.address.length < 5 || company.address.length > 30) return false;
    if(!company.city || company.city.length < 5 || company.city.length > 30) return false;
    if(company.state && (company.state.length < 5 || company.state.length > 30)) return false;
    if(!company.country || company.country.length < 5 || company.country.length > 30) return false;
    if(!company.zipcode || company.zipcode.length < 5 || company.zipcode.length > 30) return false;
    if(company.gstn && (company.gstn.length < 5 || company.gstn.length > 30)) return false;
    if(company.pan && (company.pan.length < 5 || company.pan.length > 30)) return false;
    if(!company.currency || company.currency.length < 5 || company.currency.length > 30) return false;
    return true;
}

const Company = mongoose.model('Company', CompanySchema);
export { Company, validateCompany}