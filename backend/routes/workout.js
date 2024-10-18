const express = require('express');
const router = express.Router();
const controller = require('../controllers/workoutController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/userRoles');

router.post('/', verifyRoles(ROLES_LIST.User), controller.addWorkout);
router.get('/', verifyRoles(ROLES_LIST.User), controller.getWorkouts);
router.get('/:id', verifyRoles(ROLES_LIST.User), controller.getWorkoutById);
router.put('/:id', verifyRoles(ROLES_LIST.User), controller.updateWorkout);
router.delete('/:id', verifyRoles(ROLES_LIST.User), controller.deleteWorkoutById);

module.exports = router;