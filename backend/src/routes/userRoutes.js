const express = require('express');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.use(restrictTo('Admin'));

router.route('/')
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
