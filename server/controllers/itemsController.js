const Item = require('./../models/itemsModel');

module.exports.getAllItems = (req, res) => {
  res.send('Getting all items...');
};

module.exports.getItem = (req, res) => {
  res.send(`Getting the item ${req.params.id}...`);
};

module.exports.createItem = async (req, res) => {
  try {
    const doc = await Item.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    console.log(`❌❌ ${err}`);
  }
};

module.exports.updateItem = (req, res) => {
  res.send(`The item ${req.params.id} is being UPDATED...`);
};

module.exports.deleteItem = (req, res) => {
  res.send(`The item ${req.params.id} is being DELETED...`);
};
