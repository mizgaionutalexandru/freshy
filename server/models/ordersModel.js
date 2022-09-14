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
      phoneNumber: {
        type: 'String',
        required: [true, 'A customer must provide a phone number!'],
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

orderSchema.pre('save', function (next) {
  // If there are multiples items in the shoppingCart with the same id, reduce them to one
  const items = {};
  const mongooseIds = {};

  for (const orderItem of this.shoppingCart) {
    const id = orderItem.item.toString();
    items[id] = items[id] ? items[id] + orderItem.quantity : orderItem.quantity;
    mongooseIds[id] = mongooseIds[id] || orderItem._id;
  }

  const shoppingCart = [];
  for (const item in items) {
    shoppingCart.push({
      item,
      quantity: items[item],
      _id: mongooseIds[item],
    });
  }

  this.shoppingCart = shoppingCart;
  next();
});

orderSchema.pre(/^findOne/, function (next) {
  this.populate('shoppingCart.item');
  this.select('-__v -shoppingCart._id');
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
