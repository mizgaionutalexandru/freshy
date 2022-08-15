const Item = require('./../models/itemsModel');
const catchAsync = require('./../utils/catchAsync');

module.exports.getAllItems = catchAsync(async (req, res) => {
  const items = await Item.find({});

  res.status(200).json({
    status: 'success',
    items: items.length,
    data: {
      items,
    },
  });
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
  // const item = await Item.create(req.body);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     data: item,
  //   },
  // });
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
