const express = require('express');
const viewsController = require('./../controllers/viewsController.js');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/order', viewsController.getOrder);

module.exports = router;
