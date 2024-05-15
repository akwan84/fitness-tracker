const express = require('express');
const router = express.Router();
const controller = require('../controllers/exerciseController');

router.post('/', controller.addExercise);

module.exports = router;