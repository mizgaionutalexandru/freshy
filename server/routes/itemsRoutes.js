const express = require('express');
const itemsController = require('./../controllers/itemsController.js');

const router = express.Router();

router
  .route('/')
  .get(itemsController.getAllItems)
  .post(itemsController.createItem);

router
  .route('/:id')
  .get(itemsController.getItem)
  .patch(itemsController.updateItem)
  .delete(itemsController.deleteItem);

module.exports = router;
