const express = require('express');
const ordersController = require('./../controllers/ordersController.js');

const router = express.Router();

router
  .route('/')
  .get(ordersController.getAllOrders)
  .post(ordersController.createOrder);

router
  .route('/:id')
  .get(ordersController.getOrder)
  .patch(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

module.exports = router;
