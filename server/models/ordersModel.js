const mongoose = require('mongoose');
const Item = require('./itemsModel');
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
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
          required: [true, 'An order must items in the shopping cart!'],
        },
        quantity: {
          type: 'Number',
          required: [true, "An order must contain the item's quantity!"],
          min: [0.25, "Item's quantity too low. Minimum is 0.25!"],
        },
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
  this.populate('shoppingCart.item');
  this.select('-__v -shoppingCart._id');
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
