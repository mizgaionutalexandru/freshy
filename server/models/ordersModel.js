const mongoose = require('mongoose');
const AppError = require('./../utils/appError');

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: {
        type: 'String',
        required: [true, 'A customer must have a name!'],
      },
      email: {
        type: 'String',
        required: [true, 'A customer must have an email!'],
      },
      billingAddress: {
        type: 'String',
      },
      shippingAddress: {
        type: 'String',
        required: [true, 'A customer must provide a shipping address!'],
      },
    },
    shoppingCart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: [true, 'An order must items in the shopping cart!'],
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  // Set billingAddress the same as shippingAddress if it's not provided
  if (!this.billingAddress) this.billingAddress = this.shippingAddress;
  next();
});

orderSchema.pre('save', function (next) {
  // Empty shoppingCart error
  if (!this.shoppingCart.length)
    next(new AppError('Shopping cart is empty!', 400));
  next();
});

orderSchema.pre(/^findOne/, function (next) {
  this.populate('shoppingCart');
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
