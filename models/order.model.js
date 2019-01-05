const mongoose = require('mongoose');
const Joi = require('joi');
const validateObjectId = require('../helpers/validateObjectId');

const OrderDetail = mongoose.Schema({
    itemno: { type: Number },
    name: { type: String },
    hsn: { type: String },
    mrp: { type: Number },
    quantity: { type: Number },
    margin: { type: Number },
    discountpercentage: { type: Number },
    discountamount: { type: Number },
    rate: { type: Number },
    taxrate: { type: String },
    taxamount: { type: Number },
    totalamount: { type: Number }
});

const Order = mongoose.Schema({
    billno: { type: String, required: true },
    date: { type: Date, default: Date.now },
    custid: { type: String, required: true },
    client: { type: String, required: true },
    total: { type: Number },
    discount: { type: Number, default: 0 },
    discountamount: { type: Number, default: 0 },
    totaltax: { type: Number, default: 0 },
    pkgdly: { type: Number, default: 0 },
    finalamount: { type: Number },
    status: { type: String },
    details: { type: [OrderDetail] }
});

function validateOrder(order) {

    const orderDetailSchema = {
        itemno: Joi.number().required(),
        name: Joi.string().required(),
        hsn : Joi.string().required(),
        mrp : Joi.number().required(),
        quantity: Joi.number().required(),
        margin: Joi.number(),
        discountpercentage: Joi.number(),
        discountamount: Joi.number(),
        rate: Joi.number().required(),
        taxrate: Joi.string(),
        taxamount: Joi.number(),
        totalamount: Joi.number().required()
    }
    
    const orderSchema = Joi.object({
        billno: Joi.string().required(),
        date: Joi.date().required(),
        custid: Joi.string().required(),
        client: Joi.string().required(),
        total: Joi.number().required(),
        discount: Joi.number(),
        discountamount: Joi.number(),
        totaltax: Joi.number(),
        pkgdly: Joi.number(),
        finalamount: Joi.number(),
        status: Joi.string().default('Pending'),
        details: Joi.array().min(1).items(Joi.object(orderDetailSchema)).required()
    });

    return Joi.validate(order, orderSchema);
}

Order.virtual('calcDiscount')
  .get(function() {
    return this.total * (this.discount/100);
  });

Order.virtual('calcFianlAmount')
  .get(function() {
    return this.total - this.discountamount + this.totaltax + this.pkgdly;
  });

  Order.virtual('calcFianlAmount')
  .get(function() {
    return this.total - this.discountamount + this.totaltax + this.pkgdly;
  });

function validateId(orderId) {
    return validateObjectId(orderId, "Order");
}

module.exports.Order = mongoose.model('Order', Order);
module.exports.validate = validateOrder;
module.exports.validateId = validateId;