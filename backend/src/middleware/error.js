const AppError = require('../utils/errors');
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (err.code === 11000) return res.status(400).json({ status: 'fail', message: 'Duplicate field value entered' });
    res.status(err.statusCode).json({ status: err.status, message: err.message, ...(process.env.NODE_ENV === 'development' && { error: err.stack }) });
};
