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

module.exports.getItem = (req, res) => {
  res.send(`Getting the item ${req.params.id}...`);
};

module.exports.createItem = catchAsync(async (req, res) => {
  const item = await Item.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      data: item,
    },
  });
});

module.exports.updateItem = (req, res) => {
  res.send(`The item ${req.params.id} is being UPDATED...`);
};

module.exports.deleteItem = (req, res) => {
  res.send(`The item ${req.params.id} is being DELETED...`);
};
