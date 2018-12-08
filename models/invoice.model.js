const mongoose = require('mongoose');

const Tax = mongoose.Schema({
    name: { type: String },
    rate: { type: Number },
    amount: { type: Number }
});

const InvoiceDetail = mongoose.Schema({
    itemNo: { type: Number },
    Name: { type: String },
    HSN: { type: String },
    MRP: { type: Number },
    Quantity: { type: Number },
    Margin: { type: Number },
    DiscountPercentage: { type: Number },
    DiscountAmount: { type: Number },
    Tax: { type: [Tax] },
    Rate: { type: Number },
    TaxAmount: { type: Number },
    TotalAmount: { type: Number }
});

const Invoice = mongoose.Schema({
    number: { type: String, required: true },
    date: { type: Date, default: Date.now },
    custid: { type: String, required: true },
    total: { type: Number },
    discount: { type: Number },
    discountamount: { type: Number },
    totaltax: { type: Number },
    pkgdly: { type: Number },
    finalamount: { type: Number },
    details: { type: [InvoiceDetail] }
});

module.exports = mongoose.model('Invoice', Invoice);