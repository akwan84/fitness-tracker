const express = require('express');
const router = express.Router();
const controller = require('../controllers/workoutController');

router.post('/', controller.addWorkout);

module.exports = router;