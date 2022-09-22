const Item = require('./../models/itemsModel');
const catchAsync = require('./../utils/catchAsync');

const ITEMS_SHOWN_OVERVIEW = 10;

module.exports.getOverview = catchAsync(async (req, res) => {
  const items = await Item.find({}).sort('image');
  res.status(200).render('index', {
    title: 'All products',
  });
});
