const dashboardService = require('../services/dashboardService');

exports.getDashboardSummary = async (req, res, next) => {
    try {
        const data = await dashboardService.getAnalytics();
        res.status(200).json({ status: 'success', data });
    } catch (err) { next(err); }
};
