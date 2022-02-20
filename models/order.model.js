import mongoose from 'mongoose';
import validateObjectId from '../helpers/validateObjectId.js';

const OrderDetail = mongoose.Schema({
    itemno: { type: Number },
    price: { type: Number },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number },
    discountrate: { type: Number },
    discount: { type: Number },
    taxrate: { type: String},
    tax: { type: Number },
    total: { type: Number }
});

const OrderSchema = mongoose.Schema({
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

function validateOrderDetails(orderDetail) 
{
  if(!orderDetail) return false;
  if(!orderDetail.itemno || orderDetail.itemno < 0) return false;
  if(!orderDetail.price || orderDetail.price < 0) return false;
  if(!orderDetail.quantity || orderDetail.quantity < 0) return false;
  if(!orderDetail.discountrate || orderDetail.discountrate < 0) return false;
  if(!orderDetail.discount || orderDetail.discount < 0) return false;
  if(!orderDetail.taxrate || orderDetail.taxrate.length < 2 || orderDetail.taxrate.length > 20) return false;
  if(!orderDetail.tax || orderDetail.tax < 0) return false;
  if(!orderDetail.total || orderDetail.total < 0) return false;
  return true;
}

function validateOrder(order) {
  if(!order) return false;
  if(!order.orderno || order.orderno.length < 2 || order.orderno.length > 20) return false;
  if(!order.customername || order.customername.length < 2 || order.customername.length > 30) return false;
  if(!order.total || order.total < 0) return false;
  if(!order.discountrate || order.discountrate < 0) return false;
  if(!order.discount || order.discount < 0) return false;
  if(!order.totaltax || order.totaltax < 0) return false;
  if(!order.finalamount || order.finalamount < 0) return false;
  if(!order.status || order.status.length < 2 || order.status.length > 20) return false;
  if(!order.details || order.details.length < 1) return false;
  return true;
}

OrderSchema.virtual('calcDiscount')
  .get(function() {
    return this.total * (this.discount/100);
  });

OrderSchema.virtual('calcFinalAmount')
  .get(function() {
    return this.total - this.discountamount + this.totaltax;
  });

function validateId(orderId) {
    return validateObjectId(orderId, "Order");
}

const Order = mongoose.model('Order', OrderSchema);
export { Order, validateOrder as validate, validateId }