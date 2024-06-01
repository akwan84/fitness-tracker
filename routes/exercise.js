const express = require('express');
const router = express.Router();
const controller = require('../controllers/exerciseController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/userRoles');

router.post('/', verifyRoles(ROLES_LIST.User), controller.addExercise);
router.get('/history', verifyRoles(ROLES_LIST.User), controller.getHistory);

module.exports = router;