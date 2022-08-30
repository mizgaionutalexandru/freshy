const Order = require('../models/ordersModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getAllOrders = catchAsync(async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit'];
  excludedFields.forEach((exc) => delete queryObj[exc]);
  let filter = JSON.stringify(queryObj);
  filter = filter.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  filter = JSON.parse(filter);
  // Sorting
  const sortString = req.query.sort || 'image';
  // Paginating
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 100;
  const page = parseInt(req.query.page) || DEFAULT_PAGE;
  const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .sort(sortString)
    .limit(limit)
    .skip(skip);

  const resObj = {
    status: 'success',
    page,
    orders: orders.length,
    data: {
      orders,
    },
  };

  // Delete the page property if it doesn't help
  if (
    page === DEFAULT_PAGE &&
    limit === DEFAULT_LIMIT &&
    orders.length < DEFAULT_LIMIT
  )
    delete resObj.page;

  res.status(200).json(resObj);
});

module.exports.getOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
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
