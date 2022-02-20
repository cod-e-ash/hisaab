import mongoose from 'mongoose';
import validateObjectId from '../helpers/validateObjectId.js';

const ProductSchema = mongoose.Schema({
    code: { type: String },
    name: { type: String, required: true },
    company: { type: String, required: true },
    hsn: { type: String },
    size: { type: String },
    variant: { type: String },
    unit: { type: String },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    margin: { type: Number, required: true },
    stock: { type: Number},
    taxrate: { type: String }
}); 

function validateProduct(product) {
    if(!product) return false;
    if(!product.code || product.code.length < 2 || product.code.length > 20) return false;
    if(!product.name || product.name.length < 2 || product.name.length > 20) return false;
    if(!product.company || product.company.length < 2 || product.company.length > 30) return false;
    if(product.hsn && product.hsn.length > 20) return false;
    if(product.size && product.size.length > 20) return false;
    if(product.variant && product.variant.length > 20) return false;
    if(product.unit && product.unit.length > 20) return false;
    if(!product.price || product.price < 0) return false;
    if(!product.mrp || product.mrp < 0) return false;
    if(!product.margin || product.margin < 0) return false;
    if(!product.stock || product.stock < 0) return false;
    if(!product.taxrate || product.taxrate.length < 2 || product.taxrate.length > 20) return false;
    return true;
}

function validateId(objectId) {
    return validateObjectId(objectId,"Product");
}

const Product = mongoose.model('Product', ProductSchema);
export { Product };
export {validateProduct as validate}; 
export {validateId};