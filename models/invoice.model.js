const mongoose = require('mongoose');
const Joi = require('joi');
const validateObjectId = require('../helpers/validateObjectId');

const Tax = mongoose.Schema({
    name: { type: String },
    rate: { type: Number },
    amount: { type: Number }
});

const InvoiceDetail = mongoose.Schema({
    itemno: { type: Number },
    name: { type: String },
    hsn: { type: String },
    mrp: { type: Number },
    quantity: { type: Number },
    margin: { type: Number },
    discountpercentage: { type: Number },
    discountamount: { type: Number },
    tax: { type: [Tax] },
    rate: { type: Number },
    taxamount: { type: Number },
    totalamount: { type: Number }
});

const Invoice = mongoose.Schema({
    billno: { type: String, required: true },
    date: { type: Date, default: Date.now },
    custid: { type: String, required: true },
    total: { type: Number },
    discount: { type: Number, default: 0 },
    discountamount: { type: Number, default: 0 },
    totaltax: { type: Number, default: 0 },
    pkgdly: { type: Number, default: 0 },
    finalamount: { type: Number },
    details: { type: [InvoiceDetail] }
});

function validateInvoice(invoice) {

    const invoiceTaxSchema = {
        name: Joi.string(),
        rate: Joi.number(),
        amount: Joi.number()
    }

    const invoiceDetailSchema = {
        itemno: Joi.number().required(),
        name: Joi.string().required(),
        hsn : Joi.string().required(),
        mrp : Joi.number().required(),
        quantity: Joi.number().required(),
        margin: Joi.number(),
        discountpercentage: Joi.number(),
        discountamount: Joi.number(),
        tax: Joi.array().items(Joi.object(invoiceTaxSchema)),
        rate: Joi.number().required(),
        taxamount: Joi.number(),
        totalamount: Joi.number().required()
    }
    
    const invoiceSchema = Joi.object({
        billno: Joi.string().required(),
        date: Joi.date().required(),
        custid: Joi.string().required(),
        total: Joi.number().required(),
        discount: Joi.number(),
        discountamount: Joi.number(),
        totaltax: Joi.number(),
        pkgdly: Joi.number(),
        finalamount: Joi.number(),
        details: Joi.array().min(1).items(Joi.object(invoiceDetailSchema)).required()
    });

    return Joi.validate(invoice, invoiceSchema);
}

function validateId(invoiceId) {
    return validateObjectId(invoiceId, "Invoice");
}

module.exports.Invoice = mongoose.model('Invoice', Invoice);
module.exports.validate = validateInvoice;
module.exports.validateId = validateId;