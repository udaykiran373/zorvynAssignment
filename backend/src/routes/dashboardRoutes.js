const express = require('express');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/role');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect);

router.get('/summary', restrictTo('Viewer', 'Analyst', 'Admin'), dashboardController.getDashboardSummary);

module.exports = router;
