module.exports.getAllItems = (req, res) => {
  res.send('Getting all items...');
};

module.exports.getItem = (req, res) => {
  res.send(`Getting the item ${req.params.id}...`);
};

module.exports.createItem = (req, res) => {
  res.send('A new item is being created...');
};

module.exports.updateItem = (req, res) => {
  res.send(`The item ${req.params.id} is being UPDATED...`);
};

module.exports.deleteItem = (req, res) => {
  res.send(`The item ${req.params.id} is being DELETED...`);
};
