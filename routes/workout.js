const express = require('express');
const router = express.Router();
const controller = require('../controllers/workoutController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/userRoles');

router.post('/', verifyRoles(ROLES_LIST.User), controller.addWorkout);

module.exports = router;