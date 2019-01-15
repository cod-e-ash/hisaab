const mongoose = require('mongoose');
const Customer = require('./customer.model');
const Product = require('./product.model');
const Joi = require('joi');
const validateObjectId = require('../helpers/validateObjectId');

const OrderDetail = mongoose.Schema({
    itemno: { type: Number },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number },
    discountrate: { type: Number },
    discount: { type: Number },
    tax: { type: Number },
    total: { type: Number }
});

const Order = mongoose.Schema({
    orderno: { type: String, required: true },
    date: { type: Date, default: Date.now },
    customername: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    total: { type: Number },
    discountrate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totaltax: { type: Number, default: 0 },
    finalamount: { type: Number },
    status: { type: String, default: 'Pending' },
    details: { type: [OrderDetail] }
});

function validateOrder(order) {

    const orderDetailSchema = {
        product: Joi.string(),
        quantity: Joi.number().required(),
        discountrate: Joi.number(),
        discount: Joi.number(),
        tax: Joi.number().required(),
        total: Joi.number().required()
    }

    const orderSchema = Joi.object({
        orderno: Joi.string().required(),
        date: Joi.date().required(),
        customername: Joi.string().required(),
        customer: Joi.string().required(),
        total: Joi.number().required(),
        discountrate: Joi.number(),
        discount: Joi.number(),
        totaltax: Joi.number(),
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

Order.virtual('calcFinalAmount')
  .get(function() {
    return this.total - this.discountamount + this.totaltax;
  });

function validateId(orderId) {
    return validateObjectId(orderId, "Order");
}

module.exports.Order = mongoose.model('Order', Order);
module.exports.validate = validateOrder;
module.exports.validateId = validateId;