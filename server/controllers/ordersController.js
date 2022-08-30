const Order = require('../models/ordersModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getAllOrders = catchAsync(async (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
});

module.exports.getOrder = catchAsync(async (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
});

module.exports.createOrder = catchAsync(async (req, res) => {
  const order = await Order.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      data: order,
    },
  });
});

module.exports.updateOrder = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
};

module.exports.deleteOrder = (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
};
