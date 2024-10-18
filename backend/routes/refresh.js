const express = require('express');
const router = express.Router();
const controller = require('../controllers/refreshController');

router.get('/', controller.handleRefresh);

module.exports = router;