const Item = require('./../models/itemsModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getAllItems = catchAsync(async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['sort', 'page', 'limit', 'search'];
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

  let items = await Item.find(filter).sort(sortString);

  if (req.query.search)
    items = items.filter((item) =>
      item.name.toLowerCase().includes(req.query.search.toLowerCase())
    );

  const pages = Math.ceil(items.length / limit);
  // Search for a specific query
  items = items.filter((_, index) => index >= skip && index < skip + limit);

  const resObj = {
    status: 'success',
    page,
    pages,
    items: items.length,
    data: {
      items,
    },
  };

  // Delete the page property if it doesn't help
  if (
    page === DEFAULT_PAGE &&
    limit === DEFAULT_LIMIT &&
    items.length < DEFAULT_LIMIT
  )
    delete resObj.page;

  res.status(200).json(resObj);
});

module.exports.getItem = catchAsync(async (req, res) => {
  const item = await Item.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      item,
    },
  });
});

module.exports.createItem = catchAsync(async (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
});

module.exports.updateItem = (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
};

module.exports.deleteItem = (req, res, next) => {
  res.status(501).json({
    status: 'error',
    message: 'This functionality is not yet implemented!',
  });
};
