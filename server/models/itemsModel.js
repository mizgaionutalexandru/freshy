const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  image: {
    type: 'String',
    required: [true, 'An item must have an image!'],
    unique: [true, 'An item must have an unique image!'],
  },
  name: {
    type: 'String',
    required: [true, 'An item must have a name!'],
    unique: [true, 'An item must have an unique name!'],
  },
  price: {
    type: 'Number',
    required: [true, 'An item must have a price!'],
    min: [0.1, "The item's price must be above 0.1, got {VALUE}!"],
  },
  defaultQuantity: {
    type: 'Number',
    enum: {
      values: [0.25, 0.5, 1],
      message:
        '{VALUE} default quantity is not supported. Please choose 0.25, 0.5 or 1!',
    },
    default: 1,
  },
  unit: {
    type: 'String',
    required: [true, 'An item must have an unit!'],
    enum: {
      values: ['kg', 'pc'],
      message: '{VALUE} unit is not supported. Please choose kg or pc!',
    },
  },
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
