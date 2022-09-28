const Item = require('./../models/itemsModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getOverview = catchAsync(async (req, res) => {
  res.status(200).render('index', {
    title: 'All products',
  });
});

module.exports.getOrder = catchAsync(async (req, res) => {
  res.status(200).render('order', {
    title: 'Order',
  });
});
