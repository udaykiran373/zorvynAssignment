const express = require('express');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const schemas = require('../validators/schemas');
const recordController = require('../controllers/recordController');

const router = express.Router();
router.use(protect); // All routes require authentication

router.route('/')
    .get(restrictTo('Analyst', 'Admin'), recordController.getAllRecords)
    .post(restrictTo('Admin'), validate(schemas.recordSchema), recordController.createRecord);

router.route('/:id')
    .get(restrictTo('Analyst', 'Admin'), recordController.getRecord)
    .patch(restrictTo('Admin'), validate(schemas.updateRecordSchema), recordController.updateRecord)
    .delete(restrictTo('Admin'), recordController.deleteRecord);

module.exports = router;
