const express = require('express');
const router = express.Router();
const controller = require('../controllers/workoutController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/userRoles');

router.post('/add-workout', verifyRoles(ROLES_LIST.User), controller.addWorkout);
router.get('/get-workouts', verifyRoles(ROLES_LIST.User), controller.getWorkouts);

module.exports = router;